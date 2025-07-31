export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          host_id: string;
          room_code: string;
          is_active: boolean;
          max_participants: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          host_id: string;
          room_code: string;
          is_active?: boolean;
          max_participants?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          host_id?: string;
          room_code?: string;
          is_active?: boolean;
          max_participants?: number;
          updated_at?: string;
        };
      };
      recordings: {
        Row: {
          id: string;
          room_id: string;
          title: string;
          duration: number;
          file_url: string | null;
          thumbnail_url: string | null;
          status: 'recording' | 'processing' | 'completed' | 'failed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          title: string;
          duration?: number;
          file_url?: string | null;
          thumbnail_url?: string | null;
          status?: 'recording' | 'processing' | 'completed' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          title?: string;
          duration?: number;
          file_url?: string | null;
          thumbnail_url?: string | null;
          status?: 'recording' | 'processing' | 'completed' | 'failed';
          updated_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          joined_at: string;
          left_at: string | null;
          is_host: boolean;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          joined_at?: string;
          left_at?: string | null;
          is_host?: boolean;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          joined_at?: string;
          left_at?: string | null;
          is_host?: boolean;
        };
      };
    };
  };
}