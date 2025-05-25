type Park = Database['public']['Tables']['parks']['Row'];

export const parksApi = {
  // Get all parks
  async getParks() {
    const { data, error } = await supabase
      .from('parks')
      .select('*')
      .order('park_code');
    
    if (error) throw error;
    return data;
  },

  // Get park with attractions and shows
  async getParkDetails(parkId: string) {
    const { data, error } = await supabase
      .from('parks')
      .select(`
        *,
        attractions (*),
        shows (*)
      `)
      .eq('id', parkId)
      .single();
    
    if (error) throw error;
    return data;
  }
};