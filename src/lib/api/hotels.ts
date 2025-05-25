type Hotel = Database['public']['Tables']['hotels']['Row'];

export const hotelsApi = {
  // Get all hotels with room types
  async getHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select(`
        *,
        hotel_room_types (*),
        hotel_dining (*),
        hotel_recreation (*),
        hotel_transportation (*)
      `)
      .order('tier', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get hotel by ID
  async getHotel(id: string) {
    const { data, error } = await supabase
      .from('hotels')
      .select(`
        *,
        hotel_room_types (*),
        hotel_dining (*),
        hotel_recreation (*),
        hotel_transportation (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};