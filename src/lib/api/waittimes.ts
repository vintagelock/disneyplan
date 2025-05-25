export const waitTimesApi = {
  // Get current wait times for all attractions
  async getCurrentWaitTimes() {
    const { data, error } = await supabase
      .from('wait_times')
      .select(`
        *,
        attractions (*, parks (*))
      `)
      .gte('recorded_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Last 30 minutes
      .order('recorded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get wait times for specific attraction
  async getAttractionWaitTimes(attractionId: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('wait_times')
      .select('*')
      .eq('attraction_id', attractionId)
      .gte('recorded_at', since)
      .order('recorded_at');
    
    if (error) throw error;
    return data;
  }
};
