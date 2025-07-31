import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Room = Database['public']['Tables']['rooms']['Row'];
type Recording = Database['public']['Tables']['recordings']['Row'];
type Participant = Database['public']['Tables']['participants']['Row'];

export const useRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  const createRoom = useCallback(async (name: string, description?: string) => {
    setLoading(true);
    try {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name,
          description,
          host_id: user.user.id,
          room_code: roomCode,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentRoom(data);
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinRoom = useCallback(async (roomCode: string) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Find room by code
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .eq('is_active', true)
        .single();

      if (roomError) throw roomError;
      if (!room) throw new Error('Room not found');

      // Add participant
      const { error: participantError } = await supabase
        .from('participants')
        .insert({
          room_id: room.id,
          user_id: user.user.id,
          is_host: room.host_id === user.user.id,
        });

      if (participantError) throw participantError;

      setCurrentRoom(room);
      return room;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveRoom = useCallback(async () => {
    if (!currentRoom) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Update participant left_at
      await supabase
        .from('participants')
        .update({ left_at: new Date().toISOString() })
        .eq('room_id', currentRoom.id)
        .eq('user_id', user.user.id)
        .is('left_at', null);

      setCurrentRoom(null);
      setParticipants([]);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }, [currentRoom]);

  const startRecording = useCallback(async (title: string) => {
    if (!currentRoom) throw new Error('No active room');

    try {
      const { data, error } = await supabase
        .from('recordings')
        .insert({
          room_id: currentRoom.id,
          title,
          status: 'recording',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, [currentRoom]);

  const stopRecording = useCallback(async (recordingId: string, duration: number) => {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .update({
          status: 'processing',
          duration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recordingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }, []);

  const fetchUserRooms = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('host_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, []);

  const fetchRecordings = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('recordings')
        .select(`
          *,
          rooms!inner(host_id)
        `)
        .eq('rooms.host_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    if (!currentRoom) return;

    // Subscribe to participants changes
    const participantsSubscription = supabase
      .channel(`room-${currentRoom.id}-participants`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `room_id=eq.${currentRoom.id}`,
        },
        () => {
          // Refetch participants
          supabase
            .from('participants')
            .select(`
              *,
              profiles(full_name, avatar_url)
            `)
            .eq('room_id', currentRoom.id)
            .is('left_at', null)
            .then(({ data }) => {
              setParticipants(data || []);
            });
        }
      )
      .subscribe();

    return () => {
      participantsSubscription.unsubscribe();
    };
  }, [currentRoom]);

  return {
    rooms,
    currentRoom,
    recordings,
    participants,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
    startRecording,
    stopRecording,
    fetchUserRooms,
    fetchRecordings,
  };
};