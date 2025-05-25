// src/lib/api/partyMembers.ts
type PartyMember = Database['public']['Tables']['party_members']['Row'];
type PartyMemberInsert = Database['public']['Tables']['party_members']['Insert'];
type PartyMemberUpdate = Database['public']['Tables']['party_members']['Update'];

export const partyMembersApi = {
  // Get party members for a trip
  async getPartyMembers(tripId: string) {
    const { data, error } = await supabase
      .from('party_members')
      .select('*')
      .eq('trip_id', tripId)
      .order('sort_order');
    
    if (error) throw error;
    return data;
  },

  // Add party member
  async addPartyMember(member: PartyMemberInsert) {
    const { data, error } = await supabase
      .from('party_members')
      .insert(member)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update party member
  async updatePartyMember(id: string, updates: PartyMemberUpdate) {
    const { data, error } = await supabase
      .from('party_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete party member
  async deletePartyMember(id: string) {
    const { error } = await supabase
      .from('party_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};