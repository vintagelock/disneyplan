export const restaurantsApi = {
  // Get all restaurants
  async getRestaurants() {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        parks (*),
        hotels (*)
      `)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get restaurants by park
  async getRestaurantsByPark(parkId: string) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('park_id', parkId)
      .order('name');
    
    if (error) throw error;
    return data;
  }
};