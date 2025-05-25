// src/lib/api/reservations.ts
type HotelReservation = Database['public']['Tables']['hotel_reservations']['Row'];
type HotelReservationInsert = Database['public']['Tables']['hotel_reservations']['Insert'];

type DiningReservation = Database['public']['Tables']['dining_reservations']['Row'];
type DiningReservationInsert = Database['public']['Tables']['dining_reservations']['Insert'];

type LightningLaneReservation = Database['public']['Tables']['lightning_lane_reservations']['Row'];
type LightningLaneReservationInsert = Database['public']['Tables']['lightning_lane_reservations']['Insert'];

export const reservationsApi = {
  // Hotel Reservations
  async getHotelReservations(tripId: string) {
    const { data, error } = await supabase
      .from('hotel_reservations')
      .select(`
        *,
        hotels (*),
        hotel_room_types (*)
      `)
      .eq('trip_id', tripId);
    
    if (error) throw error;
    return data;
  },

  async createHotelReservation(reservation: HotelReservationInsert) {
    const { data, error } = await supabase
      .from('hotel_reservations')
      .insert(reservation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Dining Reservations
  async getDiningReservations(tripId: string) {
    const { data, error } = await supabase
      .from('dining_reservations')
      .select(`
        *,
        restaurants (*)
      `)
      .eq('trip_id', tripId)
      .order('reservation_date');
    
    if (error) throw error;
    return data;
  },

  async createDiningReservation(reservation: DiningReservationInsert) {
    const { data, error } = await supabase
      .from('dining_reservations')
      .insert(reservation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Lightning Lane Reservations
  async getLightningLaneReservations(tripId: string) {
    const { data, error } = await supabase
      .from('lightning_lane_reservations')
      .select(`
        *,
        attractions (*, parks (*))
      `)
      .eq('trip_id', tripId)
      .order('reservation_date');
    
    if (error) throw error;
    return data;
  },

  async createLightningLaneReservation(reservation: LightningLaneReservationInsert) {
    const { data, error } = await supabase
      .from('lightning_lane_reservations')
      .insert(reservation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
