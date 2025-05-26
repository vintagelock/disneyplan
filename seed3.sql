-- Step 6: Insert Hotel Room Types (run after hotels are created)
-- Port Orleans Riverside Room Types
INSERT INTO hotel_room_types (
        hotel_id,
        name,
        max_occupancy,
        size_sq_ft,
        amenities,
        base_price_per_night
    )
SELECT h.id,
    vals.name,
    vals.max_occupancy,
    vals.size_sq_ft,
    vals.amenities,
    vals.base_price_per_night
FROM hotels h,
    (
        VALUES (
                'Disney''s Port Orleans Resort - Riverside',
                'Standard Room - Alligator Bayou',
                4,
                314,
                ARRAY ['Two queen beds', 'Rustic bayou theming', 'Mini-fridge', 'Coffee maker'],
                300.00
            ),
            (
                'Disney''s Port Orleans Resort - Riverside',
                'Standard Room - Magnolia Bend',
                4,
                314,
                ARRAY ['Two queen beds', 'Mansion-style theming', 'Mini-fridge', 'Coffee maker'],
                320.00
            ),
            (
                'Disney''s Port Orleans Resort - Riverside',
                'Preferred Room',
                4,
                314,
                ARRAY ['Close to amenities', 'Two queen beds', 'Premium location', 'River views available'],
                360.00
            ),
            (
                'Disney''s Port Orleans Resort - Riverside',
                'Royal Room',
                4,
                314,
                ARRAY ['Princess and the Frog theming', 'Special décor', 'Two queen beds', 'Kids love the theming'],
                380.00
            )
    ) AS vals(
        hotel_name,
        name,
        max_occupancy,
        size_sq_ft,
        amenities,
        base_price_per_night
    )
WHERE h.name = vals.hotel_name;
-- Grand Floridian Room Types
INSERT INTO hotel_room_types (
        hotel_id,
        name,
        max_occupancy,
        size_sq_ft,
        amenities,
        base_price_per_night
    )
SELECT h.id,
    vals.name,
    vals.max_occupancy,
    vals.size_sq_ft,
    vals.amenities,
    vals.base_price_per_night
FROM hotels h,
    (
        VALUES (
                'Disney''s Grand Floridian Resort & Spa',
                'Standard Room',
                5,
                440,
                ARRAY ['Two queen beds', 'Balcony or patio', 'Mini-fridge', 'Coffee maker'],
                800.00
            ),
            (
                'Disney''s Grand Floridian Resort & Spa',
                'Club Level Room',
                5,
                440,
                ARRAY ['Club Level access', 'Concierge service', 'Exclusive lounge', 'Complimentary snacks'],
                1200.00
            ),
            (
                'Disney''s Grand Floridian Resort & Spa',
                'One-Bedroom Villa',
                8,
                844,
                ARRAY ['Full kitchen', 'Washer/dryer', 'Living area', 'Master bedroom'],
                1500.00
            ),
            (
                'Disney''s Grand Floridian Resort & Spa',
                'Grand Villa',
                12,
                2800,
                ARRAY ['3 bedrooms', 'Full kitchen', 'Dining room', 'Multiple bathrooms'],
                3500.00
            )
    ) AS vals(
        hotel_name,
        name,
        max_occupancy,
        size_sq_ft,
        amenities,
        base_price_per_night
    )
WHERE h.name = vals.hotel_name;
-- Step 7: Insert Hotel Dining
-- Port Orleans Riverside Dining
INSERT INTO hotel_dining (
        hotel_id,
        name,
        dining_type,
        cuisine,
        price_range
    )
SELECT h.id,
    vals.name,
    vals.dining_type::restaurant_type,
    vals.cuisine,
    vals.price_range
FROM hotels h,
    (
        VALUES (
                'Disney''s Port Orleans Resort - Riverside',
                'Boatwright''s Dining Hall',
                'table_service',
                'Southern/Cajun',
                '$$'
            ),
            (
                'Disney''s Port Orleans Resort - Riverside',
                'Riverside Mill Food Court',
                'quick_service',
                'American-Southern',
                '$'
            ),
            (
                'Disney''s Port Orleans Resort - Riverside',
                'River Roost Lounge',
                'lounge',
                'Appetizers & Drinks',
                '$$'
            ),
            (
                'Disney''s Port Orleans Resort - Riverside',
                'Muddy Rivers Pool Bar',
                'quick_service',
                'Pool Snacks',
                '$'
            )
    ) AS vals(
        hotel_name,
        name,
        dining_type,
        cuisine,
        price_range
    )
WHERE h.name = vals.hotel_name;
-- Grand Floridian Dining
INSERT INTO hotel_dining (
        hotel_id,
        name,
        dining_type,
        cuisine,
        price_range
    )
SELECT h.id,
    vals.name,
    vals.dining_type::restaurant_type,
    vals.cuisine,
    vals.price_range
FROM hotels h,
    (
        VALUES (
                'Disney''s Grand Floridian Resort & Spa',
                'Victoria & Albert''s',
                'table_service',
                'American Fine Dining',
                '$$$$'
            ),
            (
                'Disney''s Grand Floridian Resort & Spa',
                'Citricos',
                'table_service',
                'Mediterranean',
                '$$$'
            ),
            (
                'Disney''s Grand Floridian Resort & Spa',
                'Narcoossee''s',
                'table_service',
                'Seafood',
                '$$$'
            ),
            (
                'Disney''s Grand Floridian Resort & Spa',
                'Grand Floridian Café',
                'table_service',
                'American',
                '$$'
            ),
            (
                'Disney''s Grand Floridian Resort & Spa',
                'Gasparilla Island Grill',
                'quick_service',
                'American',
                '$'
            )
    ) AS vals(
        hotel_name,
        name,
        dining_type,
        cuisine,
        price_range
    )
WHERE h.name = vals.hotel_name;