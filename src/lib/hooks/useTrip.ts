import { useState, useEffect } from 'react';
import { tripsApi } from '../api/trips';

export function useTrip(tripId: string) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        setLoading(true);
        const data = await tripsApi.getTrip(tripId);
        setTrip(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  return { trip, loading, error, refetch: () => fetchTrip() };
}