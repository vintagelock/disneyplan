-- Step 4: Insert Attractions (run after parks are created)
-- Magic Kingdom Attractions
INSERT INTO attractions (
        park_id,
        name,
        attraction_type,
        height_requirement,
        description,
        lightning_lane_available,
        lightning_lane_type,
        average_wait_time,
        tips,
        location_area
    )
SELECT p.id,
    vals.name,
    vals.attraction_type::attraction_type,
    vals.height_requirement,
    vals.description,
    vals.lightning_lane_available,
    vals.lightning_lane_type::lightning_lane_type,
    vals.average_wait_time,
    vals.tips,
    vals.location_area
FROM parks p,
    (
        VALUES (
                'Magic Kingdom',
                'Space Mountain',
                'thrill',
                '44" (112 cm)',
                'Indoor roller coaster through space in complete darkness',
                true,
                'genie_plus',
                45,
                ARRAY ['Best to ride early morning or late evening', 'Single rider line available'],
                'Tomorrowland'
            ),
            (
                'Magic Kingdom',
                'Seven Dwarfs Mine Train',
                'family',
                '38" (97 cm)',
                'Family coaster through the Seven Dwarfs diamond mine',
                true,
                'genie_plus',
                85,
                ARRAY ['Book immediately at 7 AM', 'Most popular family attraction'],
                'Fantasyland'
            ),
            (
                'Magic Kingdom',
                'Pirates of the Caribbean',
                'family',
                null,
                'Classic boat ride through pirate battles and treasure',
                true,
                'genie_plus',
                35,
                ARRAY ['Good afternoon option', 'Rarely has long waits'],
                'Adventureland'
            ),
            (
                'Magic Kingdom',
                'Haunted Mansion',
                'family',
                null,
                '999 happy haunts await in this spooky manor',
                true,
                'genie_plus',
                45,
                ARRAY ['Not too scary for kids', 'Holiday overlays available'],
                'Liberty Square'
            ),
            (
                'Magic Kingdom',
                'Big Thunder Mountain Railroad',
                'thrill',
                '40" (102 cm)',
                'Wildest ride in the wilderness through an old mining town',
                true,
                'genie_plus',
                30,
                ARRAY ['Great views of the park', 'Single rider line available'],
                'Frontierland'
            )
    ) AS vals(
        park_name,
        name,
        attraction_type,
        height_requirement,
        description,
        lightning_lane_available,
        lightning_lane_type,
        average_wait_time,
        tips,
        location_area
    )
WHERE p.name = vals.park_name;
-- EPCOT Attractions
INSERT INTO attractions (
        park_id,
        name,
        attraction_type,
        height_requirement,
        description,
        lightning_lane_available,
        lightning_lane_type,
        lightning_lane_price,
        average_wait_time,
        tips,
        location_area
    )
SELECT p.id,
    vals.name,
    vals.attraction_type::attraction_type,
    vals.height_requirement,
    vals.description,
    vals.lightning_lane_available,
    vals.lightning_lane_type::lightning_lane_type,
    vals.lightning_lane_price,
    vals.average_wait_time,
    vals.tips,
    vals.location_area
FROM parks p,
    (
        VALUES (
                'EPCOT',
                'Guardians of the Galaxy: Cosmic Rewind',
                'thrill',
                '42" (107 cm)',
                'Indoor roller coaster with rotating vehicles and awesome soundtrack',
                true,
                'individual',
                20.00,
                90,
                ARRAY ['Purchase at 7 AM sharp', 'Virtual queue also available'],
                'Future World'
            ),
            (
                'EPCOT',
                'Test Track',
                'thrill',
                '40" (102 cm)',
                'Design your own vehicle and test it at high speeds',
                true,
                'genie_plus',
                null,
                55,
                ARRAY ['Single rider line available', 'Design your car on the app first'],
                'Future World'
            ),
            (
                'EPCOT',
                'Frozen Ever After',
                'family',
                null,
                'Boat ride through the kingdom of Arendelle with Anna and Elsa',
                true,
                'genie_plus',
                null,
                75,
                ARRAY ['Very popular with young children', 'Located in Norway pavilion'],
                'World Showcase'
            ),
            (
                'EPCOT',
                'Soarin'' Around the World',
                'family',
                '40" (102 cm)',
                'Hang gliding simulation over world landmarks',
                true,
                'genie_plus',
                null,
                40,
                ARRAY ['Try to sit in the middle section', 'Amazing scents during ride'],
                'Future World'
            )
    ) AS vals(
        park_name,
        name,
        attraction_type,
        height_requirement,
        description,
        lightning_lane_available,
        lightning_lane_type,
        lightning_lane_price,
        average_wait_time,
        tips,
        location_area
    )
WHERE p.name = vals.park_name;
-- Step 5: Insert Shows
INSERT INTO shows (
        park_id,
        name,
        description,
        duration_minutes,
        show_times,
        recommended_arrival_minutes,
        location_area
    )
SELECT p.id,
    vals.name,
    vals.description,
    vals.duration_minutes,
    vals.show_times,
    vals.recommended_arrival_minutes,
    vals.location_area
FROM parks p,
    (
        VALUES (
                'Magic Kingdom',
                'Happily Ever After',
                'Spectacular fireworks show with projections on Cinderella Castle',
                18,
                ARRAY ['21:00'],
                45,
                'Main Street U.S.A.'
            ),
            (
                'Magic Kingdom',
                'Festival of Fantasy Parade',
                'Colorful parade featuring Disney characters and floats',
                12,
                ARRAY ['15:00'],
                30,
                'Main Street U.S.A.'
            ),
            (
                'EPCOT',
                'EPCOT Forever',
                'Fireworks spectacular celebrating EPCOT',
                12,
                ARRAY ['21:00'],
                30,
                'World Showcase Lagoon'
            ),
            (
                'Hollywood Studios',
                'Fantasmic!',
                'Nighttime spectacular featuring Mickey''s imagination',
                30,
                ARRAY ['20:00', '22:00'],
                45,
                'Hollywood Hills Amphitheater'
            ),
            (
                'Animal Kingdom',
                'Rivers of Light',
                'Nighttime show with water, lights, and music',
                15,
                ARRAY ['19:30', '21:00'],
                30,
                'Discovery River'
            )
    ) AS vals(
        park_name,
        name,
        description,
        duration_minutes,
        show_times,
        recommended_arrival_minutes,
        location_area
    )
WHERE p.name = vals.park_name;