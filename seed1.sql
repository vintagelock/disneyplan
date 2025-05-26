-- Simplified Supabase Data Seeding Script
-- Run this in smaller chunks to avoid truncation issues
-- Step 1: Insert Parks
--INSERT INTO parks (park_code, name, icon, description, opening_time, closing_time, early_entry_time) VALUES
--('magic_kingdom', 'Magic Kingdom', '🏰', 'The most magical place on earth with classic Disney attractions and characters', '09:00', '22:00', '08:30'),
--('epcot', 'EPCOT', '🌍', 'Future World and World Showcase celebrating innovation and culture', '09:00', '21:00', '08:30'),
--('hollywood_studios', 'Hollywood Studios', '🎬', 'Movies, TV, music and theater come to life', '09:00', '20:00', '08:30'),
--('animal_kingdom', 'Animal Kingdom', '🦁', 'Adventure, thrills and the magic of nature', '08:00', '19:00', '07:30');
-- Step 2: Insert Hotels
INSERT INTO hotels (
        name,
        tier,
        location,
        theme,
        description,
        total_rooms,
        year_opened,
        year_renovated,
        check_in_time,
        check_out_time,
        parking_cost,
        early_magic_hours,
        rating
    )
VALUES (
        'Disney''s Port Orleans Resort - Riverside',
        'moderate',
        'Disney Springs Resort Area',
        'Southern charm and bayou atmosphere',
        'Experience the charm of the antebellum South along the Sassagoula River.',
        2048,
        1992,
        2019,
        '15:00',
        '11:00',
        0,
        true,
        4.3
    ),
    (
        'Disney''s Grand Floridian Resort & Spa',
        'deluxe_villa',
        'Magic Kingdom Resort Area',
        'Victorian elegance and luxury',
        'Experience the grandeur of a bygone era at this Victorian-style resort.',
        867,
        1988,
        2013,
        '15:00',
        '11:00',
        25,
        true,
        4.6
    );
-- Step 3: Insert Dining Plans
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