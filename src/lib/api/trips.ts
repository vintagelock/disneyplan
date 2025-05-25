// src/lib/api/trips.ts
import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Trip = Database['public']['Tables']['trips']['Row'];
type TripInsert = Database['public']['Tables']['trips']['Insert'];
type TripUpdate = Database['public']['Tables']['trips']['Update'];

export const tripsApi = {
  // Get all trips for current user
  async getTrips() {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get single trip by ID
  async getTrip(id: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        party_members (*),
        hotel_reservations (
          *,
          hotels (*),
          hotel_room_types (*)
        ),
        dining_reservations (
          *,
          restaurants (*)
        ),
        lightning_lane_reservations (
          *,
          attractions (*)
        ),
        daily_events (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new trip
  async createTrip(trip: TripInsert) {
    const { data, error } = await supabase
      .from('trips')
      .insert(trip)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update trip
  async updateTrip(id: string, updates: TripUpdate) {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete trip
  async deleteTrip(id: string) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
