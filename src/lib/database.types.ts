export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user';
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user';
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string;
          party_size: number;
          status: 'planning' | 'active' | 'completed' | 'cancelled';
          current_step: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name?: string;
          start_date: string;
          end_date: string;
          party_size?: number;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          current_step?: string;
        };
        Update: {
          name?: string;
          start_date?: string;
          end_date?: string;
          party_size?: number;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          current_step?: string;
        };
      };
      party_members: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          age: number;
          ticket_type: string;
          dietary_restrictions: string;
          disabilities: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          trip_id: string;
          name: string;
          age: number;
          ticket_type?: string;
          dietary_restrictions?: string;
          disabilities?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          age?: number;
          ticket_type?: string;
          dietary_restrictions?: string;
          disabilities?: boolean;
          sort_order?: number;
        };
      };
      parks: {
        Row: {
          id: string;
          park_code: 'magic_kingdom' | 'epcot' | 'hollywood_studios' | 'animal_kingdom';
          name: string;
          icon: string;
          description: string | null;
          opening_time: string | null;
          closing_time: string | null;
          early_entry_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          park_code: 'magic_kingdom' | 'epcot' | 'hollywood_studios' | 'animal_kingdom';
          name: string;
          icon: string;
          description?: string | null;
          opening_time?: string | null;
          closing_time?: string | null;
          early_entry_time?: string | null;
        };
        Update: {
          name?: string;
          icon?: string;
          description?: string | null;
          opening_time?: string | null;
          closing_time?: string | null;
          early_entry_time?: string | null;
        };
      };
      attractions: {
        Row: {
          id: string;
          park_id: string;
          name: string;
          attraction_type: 'thrill' | 'family' | 'show' | 'character';
          height_requirement: string | null;
          description: string | null;
          lightning_lane_available: boolean;
          lightning_lane_type: 'genie_plus' | 'individual' | null;
          lightning_lane_price: number | null;
          average_wait_time: number;
          tips: string[] | null;
          location_area: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          park_id: string;
          name: string;
          attraction_type: 'thrill' | 'family' | 'show' | 'character';
          height_requirement?: string | null;
          description?: string | null;
          lightning_lane_available?: boolean;
          lightning_lane_type?: 'genie_plus' | 'individual' | null;
          lightning_lane_price?: number | null;
          average_wait_time?: number;
          tips?: string[] | null;
          location_area?: string | null;
        };
        Update: {
          name?: string;
          attraction_type?: 'thrill' | 'family' | 'show' | 'character';
          height_requirement?: string | null;
          description?: string | null;
          lightning_lane_available?: boolean;
          lightning_lane_type?: 'genie_plus' | 'individual' | null;
          lightning_lane_price?: number | null;
          average_wait_time?: number;
          tips?: string[] | null;
          location_area?: string | null;
        };
      };
      hotels: {
        Row: {
          id: string;
          name: string;
          tier: 'value' | 'moderate' | 'deluxe' | 'deluxe_villa' | 'other';
          location: string | null;
          theme: string | null;
          description: string | null;
          total_rooms: number | null;
          year_opened: number | null;
          year_renovated: number | null;
          check_in_time: string;
          check_out_time: string;
          parking_cost: number;
          early_magic_hours: boolean;
          rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          tier: 'value' | 'moderate' | 'deluxe' | 'deluxe_villa' | 'other';
          location?: string | null;
          theme?: string | null;
          description?: string | null;
          total_rooms?: number | null;
          year_opened?: number | null;
          year_renovated?: number | null;
          check_in_time?: string;
          check_out_time?: string;
          parking_cost?: number;
          early_magic_hours?: boolean;
          rating?: number | null;
        };
        Update: {
          name?: string;
          tier?: 'value' | 'moderate' | 'deluxe' | 'deluxe_villa' | 'other';
          location?: string | null;
          theme?: string | null;
          description?: string | null;
          total_rooms?: number | null;
          year_opened?: number | null;
          year_renovated?: number | null;
          check_in_time?: string;
          check_out_time?: string;
          parking_cost?: number;
          early_magic_hours?: boolean;
          rating?: number | null;
        };
      };
      hotel_reservations: {
        Row: {
          id: string;
          trip_id: string;
          hotel_id: string;
          room_type_id: string;
          check_in_date: string;
          check_out_date: string;
          guests: number;
          nights: number;
          price_per_night: number;
          total_cost: number;
          status: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          confirmation_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          trip_id: string;
          hotel_id: string;
          room_type_id: string;
          check_in_date: string;
          check_out_date: string;
          guests: number;
          nights: number;
          price_per_night: number;
          total_cost: number;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          confirmation_number?: string | null;
          notes?: string | null;
        };
        Update: {
          check_in_date?: string;
          check_out_date?: string;
          guests?: number;
          nights?: number;
          price_per_night?: number;
          total_cost?: number;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          confirmation_number?: string | null;
          notes?: string | null;
        };
      };
      restaurants: {
        Row: {
          id: string;
          park_id: string | null;
          hotel_id: string | null;
          name: string;
          restaurant_type: 'table_service' | 'quick_service' | 'character_dining' | 'lounge';
          cuisine: string | null;
          location: string | null;
          price_range: string | null;
          rating: number | null;
          hours_open: string | null;
          hours_close: string | null;
          reservation_difficulty: string | null;
          specialties: string[] | null;
          atmosphere: string | null;
          dining_plan_accepted: boolean;
          characters: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          park_id?: string | null;
          hotel_id?: string | null;
          name: string;
          restaurant_type: 'table_service' | 'quick_service' | 'character_dining' | 'lounge';
          cuisine?: string | null;
          location?: string | null;
          price_range?: string | null;
          rating?: number | null;
          hours_open?: string | null;
          hours_close?: string | null;
          reservation_difficulty?: string | null;
          specialties?: string[] | null;
          atmosphere?: string | null;
          dining_plan_accepted?: boolean;
          characters?: string[] | null;
        };
        Update: {
          name?: string;
          restaurant_type?: 'table_service' | 'quick_service' | 'character_dining' | 'lounge';
          cuisine?: string | null;
          location?: string | null;
          price_range?: string | null;
          rating?: number | null;
          hours_open?: string | null;
          hours_close?: string | null;
          reservation_difficulty?: string | null;
          specialties?: string[] | null;
          atmosphere?: string | null;
          dining_plan_accepted?: boolean;
          characters?: string[] | null;
        };
      };
      dining_reservations: {
        Row: {
          id: string;
          trip_id: string;
          restaurant_id: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          status: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          confirmation_number: string | null;
          special_requests: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          trip_id: string;
          restaurant_id: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          confirmation_number?: string | null;
          special_requests?: string | null;
          notes?: string | null;
        };
        Update: {
          reservation_date?: string;
          reservation_time?: string;
          party_size?: number;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          confirmation_number?: string | null;
          special_requests?: string | null;
          notes?: string | null;
        };
      };
      lightning_lane_reservations: {
        Row: {
          id: string;
          trip_id: string;
          attraction_id: string;
          reservation_date: string;
          return_time_start: string;
          return_time_end: string;
          party_size: number;
          lightning_lane_type: 'genie_plus' | 'individual';
          cost_per_person: number | null;
          total_cost: number | null;
          status: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          booking_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          trip_id: string;
          attraction_id: string;
          reservation_date: string;
          return_time_start: string;
          return_time_end: string;
          party_size: number;
          lightning_lane_type: 'genie_plus' | 'individual';
          cost_per_person?: number | null;
          total_cost?: number | null;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
          booking_time?: string;
        };
        Update: {
          reservation_date?: string;
          return_time_start?: string;
          return_time_end?: string;
          party_size?: number;
          lightning_lane_type?: 'genie_plus' | 'individual';
          cost_per_person?: number | null;
          total_cost?: number | null;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used';
        };
      };
      daily_events: {
        Row: {
          id: string;
          trip_id: string;
          event_date: string;
          event_time: string;
          title: string;
          event_type: 'park' | 'dining' | 'lightning_lane' | 'show' | 'hotel' | 'travel' | 'break';
          location: string | null;
          description: string | null;
          party_size: number | null;
          confirmation_number: string | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          trip_id: string;
          event_date: string;
          event_time: string;
          title: string;
          event_type: 'park' | 'dining' | 'lightning_lane' | 'show' | 'hotel' | 'travel' | 'break';
          location?: string | null;
          description?: string | null;
          party_size?: number | null;
          confirmation_number?: string | null;
          notes?: string | null;
          sort_order?: number;
        };
        Update: {
          event_date?: string;
          event_time?: string;
          title?: string;
          event_type?: 'park' | 'dining' | 'lightning_lane' | 'show' | 'hotel' | 'travel' | 'break';
          location?: string | null;
          description?: string | null;
          party_size?: number | null;
          confirmation_number?: string | null;
          notes?: string | null;
          sort_order?: number;
        };
      };
      wait_times: {
        Row: {
          id: string;
          attraction_id: string;
          recorded_at: string;
          wait_time_minutes: number;
          lightning_lane_wait_minutes: number | null;
          is_operational: boolean;
          created_at: string;
        };
        Insert: {
          attraction_id: string;
          recorded_at?: string;
          wait_time_minutes: number;
          lightning_lane_wait_minutes?: number | null;
          is_operational?: boolean;
        };
        Update: {
          wait_time_minutes?: number;
          lightning_lane_wait_minutes?: number | null;
          is_operational?: boolean;
        };
      };
    };
  };
}