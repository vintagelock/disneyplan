import React, { useState, useEffect } from 'react';

import '../index.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

// Using the new 6.x themeparks API (themeparks.wiki API)
// Install with: npm install themeparks@latest

interface Park {
  id: string;
  name: string;
  timezone: string;
}

interface WaitTime {
  id: string;
  name: string;
  is_open: boolean;
  wait_time: number | null;
  last_updated: string;
}

interface Schedule {
  date: string;
  opening_time: string;
  closing_time: string;
  type: string;
}

const ThemeParkComponent: React.FC = () => {
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [waitTimes, setWaitTimes] = useState<WaitTime[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Note: The new 6.x API requires API calls to themeparks.wiki
  // You'll need to implement these using fetch() or axios
  const API_BASE = 'https://api.themeparks.wiki/v1';

  // Fetch available parks
  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch(`${API_BASE}/destinations`);
        const data = await response.json();
        
        // Extract parks from destinations
        const allParks: Park[] = [];
        data.destinations?.forEach((destination: any) => {
          destination.parks?.forEach((park: any) => {
            allParks.push({
              id: park.id,
              name: park.name,
              timezone: park.timezone || 'UTC'
            });
          });
        });
        
        setParks(allParks);
      } catch (err) {
        setError('Failed to fetch parks: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    };

    fetchParks();
  }, []);

  const fetchWaitTimes = async (park: Park) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/entity/${park.id}/live`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the API response to match our interface
      const waitTimesData: WaitTime[] = data.liveData?.map((item: any) => ({
        id: item.id,
        name: item.name,
        is_open: item.status === 'OPERATING',
        wait_time: item.queue?.STANDBY?.waitTime || null,
        last_updated: item.lastUpdate || new Date().toISOString()
      })) || [];
      
      setWaitTimes(waitTimesData);
    } catch (err) {
      setError('Failed to fetch wait times: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async (park: Park) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/entity/${park.id}/schedule`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform schedule data
      const scheduleData: Schedule[] = data.schedule?.map((day: any) => ({
        date: day.date,
        opening_time: day.openingTime || 'Closed',
        closing_time: day.closingTime || 'Closed',
        type: day.type || 'Regular'
      })) || [];
      
      setSchedule(scheduleData);
    } catch (err) {
      setError('Failed to fetch schedule: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleParkSelect = (park: Park) => {
    setSelectedPark(park);
    setWaitTimes([]);
    setSchedule([]);
    setError('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Theme Park Information</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">API Notice</h3>
        <p className="text-yellow-700 text-sm">
          This component uses the new ThemeParks.wiki API (v6.x). The old themeparks library (v5.x) is deprecated. 
          Make sure to install: <code className="bg-yellow-100 px-1 rounded">npm install themeparks@latest</code>
        </p>
      </div>

      {/* Parks Loading State */}
      {parks.length === 0 && !error && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading theme parks...</p>
        </div>
      )}

      {/* Park Selection */}
      {parks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Select a Park ({parks.length} available):</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {parks.map((park) => (
              <button
                key={park.id}
                onClick={() => handleParkSelect(park)}
                className={`p-3 rounded-lg border transition-colors text-left ${
                  selectedPark?.id === park.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white hover:bg-gray-50 border-gray-300'
                }`}
              >
                <div className="font-medium">{park.name}</div>
                <div className="text-sm opacity-75">{park.timezone}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedPark && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Selected Park: {selectedPark.name}</h3>
            <p className="text-gray-600">Park ID: {selectedPark.id}</p>
            <p className="text-gray-600">Timezone: {selectedPark.timezone}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => fetchWaitTimes(selectedPark)}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Live Wait Times'}
            </button>
            <button
              onClick={() => fetchSchedule(selectedPark)}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Schedule'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Wait Times Display */}
          {waitTimes.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Live Wait Times ({waitTimes.length} attractions)</h3>
              <div className="grid gap-3">
                {waitTimes.map((ride) => (
                  <div key={ride.id} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{ride.name}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(ride.last_updated).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ride.is_open ? (
                          <span className="text-lg font-bold text-blue-600">
                            {ride.wait_time !== null ? `${ride.wait_time} min` : 'Open'}
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">Closed</span>
                        )}
                        <div className={`w-3 h-3 rounded-full ${ride.is_open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Display */}
          {schedule.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Park Schedule ({schedule.length} days)</h3>
              <div className="grid gap-3">
                {schedule.slice(0, 14).map((day, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">{day.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {day.opening_time === 'Closed' ? 'Closed' : `${day.opening_time} - ${day.closing_time}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State Messages */}
          {!loading && waitTimes.length === 0 && schedule.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              Select "Get Live Wait Times" or "Get Schedule" to see park data
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeParkComponent;