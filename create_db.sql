-- Disney Trip Planner Database Schema for Supabase
-- This schema supports the Lewis Family Disney Trip application
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE trip_status AS ENUM ('planning', 'active', 'completed', 'cancelled');
CREATE TYPE reservation_status AS ENUM (
    'confirmed',
    'pending',
    'cancelled',
    'expired',
    'used',
    'upcoming'
);
CREATE TYPE park_enum AS ENUM (
    'magic_kingdom',
    'epcot',
    'hollywood_studios',
    'animal_kingdom'
);
CREATE TYPE attraction_type AS ENUM ('thrill', 'family', 'show', 'character');
CREATE TYPE restaurant_type AS ENUM (
    'table_service',
    'quick_service',
    'character_dining',
    'lounge'
);
CREATE TYPE hotel_tier AS ENUM (
    'value',
    'moderate',
    'deluxe',
    'deluxe_villa',
    'other'
);
CREATE TYPE lightning_lane_type AS ENUM ('genie_plus', 'individual');
CREATE TYPE event_type AS ENUM (
    'park',
    'dining',
    'lightning_lane',
    'show',
    'hotel',
    'travel',
    'break'
);
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT 'Lewis Family Disney Trip',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 1,
    status trip_status DEFAULT 'planning',
    current_step TEXT DEFAULT 'overview',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_party_size CHECK (
        party_size > 0
        AND party_size <= 20
    )
);
-- Party members table
CREATE TABLE party_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    ticket_type TEXT NOT NULL DEFAULT 'Base Ticket',
    dietary_restrictions TEXT DEFAULT 'None',
    disabilities BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_age CHECK (
        age >= 0
        AND age <= 120
    )
);
-- Parks table (reference data)
CREATE TABLE parks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    park_code park_enum UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    opening_time TIME,
    closing_time TIME,
    early_entry_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Attractions table (reference data)
CREATE TABLE attractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    park_id UUID REFERENCES parks(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    attraction_type attraction_type NOT NULL,
    height_requirement TEXT,
    description TEXT,
    lightning_lane_available BOOLEAN DEFAULT FALSE,
    lightning_lane_type lightning_lane_type,
    lightning_lane_price DECIMAL(5, 2),
    average_wait_time INTEGER DEFAULT 0,
    tips TEXT [],
    location_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Shows table (reference data)
CREATE TABLE shows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    park_id UUID REFERENCES parks(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    show_times TIME [],
    recommended_arrival_minutes INTEGER DEFAULT 30,
    location_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Hotels table (reference data)
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tier hotel_tier NOT NULL,
    location TEXT,
    theme TEXT,
    description TEXT,
    total_rooms INTEGER,
    year_opened INTEGER,
    year_renovated INTEGER,
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    parking_cost DECIMAL(6, 2) DEFAULT 0,
    early_magic_hours BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Hotel room types table
CREATE TABLE hotel_room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    max_occupancy INTEGER NOT NULL,
    size_sq_ft INTEGER,
    amenities TEXT [],
    base_price_per_night DECIMAL(8, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Hotel dining options table
CREATE TABLE hotel_dining (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    dining_type restaurant_type NOT NULL,
    cuisine TEXT,
    price_range TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Hotel recreation table
CREATE TABLE hotel_recreation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    recreation_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Hotel transportation table
CREATE TABLE hotel_transportation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE NOT NULL,
    destination TEXT NOT NULL,
    method TEXT NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Restaurants table (reference data)
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    park_id UUID REFERENCES parks(id) ON DELETE
    SET NULL,
        hotel_id UUID REFERENCES hotels(id) ON DELETE
    SET NULL,
        name TEXT NOT NULL,
        restaurant_type restaurant_type NOT NULL,
        cuisine TEXT,
        location TEXT,
        price_range TEXT,
        rating DECIMAL(2, 1),
        hours_open TIME,
        hours_close TIME,
        reservation_difficulty TEXT,
        specialties TEXT [],
        atmosphere TEXT,
        dining_plan_accepted BOOLEAN DEFAULT TRUE,
        characters TEXT [],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT restaurant_location CHECK (
            (
                park_id IS NOT NULL
                AND hotel_id IS NULL
            )
            OR (
                park_id IS NULL
                AND hotel_id IS NOT NULL
            )
        )
);
-- Hotel reservations table
CREATE TABLE hotel_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    hotel_id UUID REFERENCES hotels(id) NOT NULL,
    room_type_id UUID REFERENCES hotel_room_types(id) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INTEGER NOT NULL,
    nights INTEGER NOT NULL,
    price_per_night DECIMAL(8, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status reservation_status DEFAULT 'confirmed',
    confirmation_number TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_hotel_dates CHECK (check_out_date > check_in_date),
    CONSTRAINT valid_hotel_guests CHECK (
        guests > 0
        AND guests <= 20
    )
);
-- Dining reservations table
CREATE TABLE dining_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    status reservation_status DEFAULT 'confirmed',
    confirmation_number TEXT,
    special_requests TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dining_party_size CHECK (
        party_size > 0
        AND party_size <= 20
    )
);
-- Lightning Lane reservations table
CREATE TABLE lightning_lane_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    attraction_id UUID REFERENCES attractions(id) NOT NULL,
    reservation_date DATE NOT NULL,
    return_time_start TIME NOT NULL,
    return_time_end TIME NOT NULL,
    party_size INTEGER NOT NULL,
    lightning_lane_type lightning_lane_type NOT NULL,
    cost_per_person DECIMAL(5, 2),
    total_cost DECIMAL(8, 2),
    status reservation_status DEFAULT 'confirmed',
    booking_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_ll_party_size CHECK (
        party_size > 0
        AND party_size <= 20
    ),
    CONSTRAINT valid_return_times CHECK (return_time_end > return_time_start)
);
-- Daily schedule/calendar events table
CREATE TABLE daily_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    title TEXT NOT NULL,
    event_type event_type NOT NULL,
    location TEXT,
    description TEXT,
    party_size INTEGER,
    confirmation_number TEXT,
    notes TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Park strategies table (for Lightning Lane strategies)
CREATE TABLE park_strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    park_id UUID REFERENCES parks(id) ON DELETE CASCADE NOT NULL,
    strategy_date DATE NOT NULL,
    rope_drop_attraction TEXT,
    recommended_plan JSONB,
    individual_ll_recommendations JSONB,
    time_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Wait times table (for real-time/historical data)
CREATE TABLE wait_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attraction_id UUID REFERENCES attractions(id) ON DELETE CASCADE NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    wait_time_minutes INTEGER NOT NULL,
    lightning_lane_wait_minutes INTEGER,
    is_operational BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_wait_times CHECK (
        wait_time_minutes >= 0
        AND wait_time_minutes <= 300
        AND (
            lightning_lane_wait_minutes IS NULL
            OR lightning_lane_wait_minutes >= 0
        )
    )
);
-- Dining plans table (reference data)
CREATE TABLE dining_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price_per_adult_per_day DECIMAL(6, 2) NOT NULL,
    price_per_child_per_day DECIMAL(6, 2) NOT NULL,
    description TEXT,
    includes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Favorites table (for attractions, restaurants, hotels)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    item_type TEXT NOT NULL,
    -- 'attraction', 'restaurant', 'hotel'
    item_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);
-- Indexes for performance
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_party_members_trip_id ON party_members(trip_id);
CREATE INDEX idx_attractions_park_id ON attractions(park_id);
CREATE INDEX idx_shows_park_id ON shows(park_id);
CREATE INDEX idx_hotel_room_types_hotel_id ON hotel_room_types(hotel_id);
CREATE INDEX idx_restaurants_park_id ON restaurants(park_id);
CREATE INDEX idx_restaurants_hotel_id ON restaurants(hotel_id);
CREATE INDEX idx_hotel_reservations_trip_id ON hotel_reservations(trip_id);
CREATE INDEX idx_dining_reservations_trip_id ON dining_reservations(trip_id);
CREATE INDEX idx_dining_reservations_date ON dining_reservations(reservation_date);
CREATE INDEX idx_lightning_lane_reservations_trip_id ON lightning_lane_reservations(trip_id);
CREATE INDEX idx_lightning_lane_reservations_date ON lightning_lane_reservations(reservation_date);
CREATE INDEX idx_daily_events_trip_id ON daily_events(trip_id);
CREATE INDEX idx_daily_events_date ON daily_events(event_date);
CREATE INDEX idx_wait_times_attraction_id ON wait_times(attraction_id);
CREATE INDEX idx_wait_times_recorded_at ON wait_times(recorded_at);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
-- RLS (Row Level Security) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dining_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lightning_lane_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR
UPDATE USING (auth.uid() = id);
-- Trip policies
CREATE POLICY "Users can view own trips" ON trips FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trips" ON trips FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON trips FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON trips FOR DELETE USING (auth.uid() = user_id);
-- Party members policies
CREATE POLICY "Users can view own party members" ON party_members FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = party_members.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own party members" ON party_members FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = party_members.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own party members" ON party_members FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = party_members.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own party members" ON party_members FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM trips
        WHERE trips.id = party_members.trip_id
            AND trips.user_id = auth.uid()
    )
);
-- Hotel reservations policies
CREATE POLICY "Users can view own hotel reservations" ON hotel_reservations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = hotel_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own hotel reservations" ON hotel_reservations FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = hotel_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own hotel reservations" ON hotel_reservations FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = hotel_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own hotel reservations" ON hotel_reservations FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM trips
        WHERE trips.id = hotel_reservations.trip_id
            AND trips.user_id = auth.uid()
    )
);
-- Dining reservations policies
CREATE POLICY "Users can view own dining reservations" ON dining_reservations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = dining_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own dining reservations" ON dining_reservations FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = dining_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own dining reservations" ON dining_reservations FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = dining_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own dining reservations" ON dining_reservations FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM trips
        WHERE trips.id = dining_reservations.trip_id
            AND trips.user_id = auth.uid()
    )
);
-- Lightning Lane reservations policies
CREATE POLICY "Users can view own LL reservations" ON lightning_lane_reservations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = lightning_lane_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own LL reservations" ON lightning_lane_reservations FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = lightning_lane_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own LL reservations" ON lightning_lane_reservations FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = lightning_lane_reservations.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own LL reservations" ON lightning_lane_reservations FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM trips
        WHERE trips.id = lightning_lane_reservations.trip_id
            AND trips.user_id = auth.uid()
    )
);
-- Daily events policies
CREATE POLICY "Users can view own daily events" ON daily_events FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = daily_events.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own daily events" ON daily_events FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = daily_events.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own daily events" ON daily_events FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM trips
            WHERE trips.id = daily_events.trip_id
                AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own daily events" ON daily_events FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM trips
        WHERE trips.id = daily_events.trip_id
            AND trips.user_id = auth.uid()
    )
);
-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR
UPDATE USING (auth.uid() = user_id);
-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
-- Reference data is readable by all authenticated users
CREATE POLICY "Anyone can view parks" ON parks FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view attractions" ON attractions FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view shows" ON shows FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view hotels" ON hotels FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view hotel room types" ON hotel_room_types FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view hotel dining" ON hotel_dining FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view hotel recreation" ON hotel_recreation FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view hotel transportation" ON hotel_transportation FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view restaurants" ON restaurants FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view park strategies" ON park_strategies FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view wait times" ON wait_times FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view dining plans" ON dining_plans FOR
SELECT TO authenticated USING (true);
-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE
UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_party_members_updated_at BEFORE
UPDATE ON party_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parks_updated_at BEFORE
UPDATE ON parks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attractions_updated_at BEFORE
UPDATE ON attractions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shows_updated_at BEFORE
UPDATE ON shows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE
UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_room_types_updated_at BEFORE
UPDATE ON hotel_room_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE
UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_reservations_updated_at BEFORE
UPDATE ON hotel_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dining_reservations_updated_at BEFORE
UPDATE ON dining_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lightning_lane_reservations_updated_at BEFORE
UPDATE ON lightning_lane_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_events_updated_at BEFORE
UPDATE ON daily_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE
UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.users (id, email, full_name)
VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Sample reference data inserts (you can run these after creating the schema)
-- Insert parks
INSERT INTO parks (
        park_code,
        name,
        icon,
        description,
        opening_time,
        closing_time,
        early_entry_time
    )
VALUES (
        'magic_kingdom',
        'Magic Kingdom',
        '🏰',
        'The most magical place on earth with classic Disney attractions and characters',
        '09:00',
        '22:00',
        '08:30'
    ),
    (
        'epcot',
        'EPCOT',
        '🌍',
        'Future World and World Showcase celebrating innovation and culture',
        '09:00',
        '21:00',
        '08:30'
    ),
    (
        'hollywood_studios',
        'Hollywood Studios',
        '🎬',
        'Movies, TV, music and theater come to life',
        '09:00',
        '20:00',
        '08:30'
    ),
    (
        'animal_kingdom',
        'Animal Kingdom',
        '🦁',
        'Adventure, thrills and the magic of nature',
        '08:00',
        '19:00',
        '07:30'
    );
-- Insert dining plans
INSERT INTO dining_plans (
        name,
        price_per_adult_per_day,
        price_per_child_per_day,
        description,
        includes
    )
VALUES (
        'Disney Quick-Service Dining Plan',
        57.00,
        23.00,
        'Perfect for families who prefer quick, casual dining',
        '["2 Quick-Service meals", "2 Snacks", "1 Resort refillable mug"]'::jsonb
    ),
    (
        'Disney Dining Plan',
        78.00,
        30.00,
        'Great balance of table and quick service dining',
        '["1 Table-Service meal", "1 Quick-Service meal", "2 Snacks", "1 Resort refillable mug"]'::jsonb
    ),
    (
        'Disney Deluxe Dining Plan',
        119.00,
        42.00,
        'For food lovers who want maximum flexibility and premium dining',
        '["3 meals (Table or Quick-Service)", "2 Snacks", "1 Resort refillable mug"]'::jsonb
    );
-- This schema provides:
-- 1. Complete user management with RLS security
-- 2. Trip planning with party members
-- 3. All reservation types (hotel, dining, Lightning Lane)
-- 4. Reference data for parks, attractions, shows, hotels, restaurants
-- 5. Daily calendar/scheduling system
-- 6. Wait times tracking
-- 7. User preferences and favorites
-- 8. Comprehensive indexing for performance
-- 9. Automatic timestamp management
-- 10. Flexible JSONB fields for complex data structures