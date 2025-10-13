USE SMUUTH_Events;
-- For data clean up
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE user;
TRUNCATE event;
TRUNCATE application;
TRUNCATE points_ledger;
TRUNCATE user_warning;
SET FOREIGN_KEY_CHECKS=1;

-- Sample Users
INSERT INTO user (email, username, password_hash, name, role, points, certifications)
VALUES
('alice@example.com', 'alicetan', '$2y$10$samplehashalice', 'Alice Tan', 'helper', 50, '["CPR","First Aid"]'),
('bob@example.com', 'boblim', '$2y$10$samplehashbob', 'Bob Lim', 'helper', 20, NULL),
('carol@example.com', 'carolwong', '$2y$10$samplehashcarol', 'Carol Wong', 'admin', 0, NULL),
('mallory@example.com', 'mallorydoe', '$2y$10$samplehashmallory', 'Mallory Doe', 'helper', 0, NULL);


-- Sample Events
INSERT INTO event (title, description, organiser_user_id, location_name, lat, lng, address, start_datetime, end_datetime, required_pax, reward_amount, requirement_tags, status)
VALUES
('Beach Cleanup', 'Join us to clean the local beach.', 3, 'East Coast Beach', 1.303, 103.908, 'East Coast Park, Singapore', '2025-10-15 09:00:00', '2025-10-15 12:00:00', 10, 100.00, '["outdoors","physical"]', 'open'),
('Food Drive', 'Help distribute food to the needy.', 3, 'Community Center', 1.352, 103.819, '123 Community Rd, Singapore', '2025-10-20 14:00:00', '2025-10-20 18:00:00', 5, 50.00, '["indoor","light"]', 'open');

-- Sample Applications
INSERT INTO application (event_id, user_id, status, applied_at)
VALUES
(1, 1, 'applied', '2025-10-01 10:00:00'),
(1, 2, 'accepted', '2025-10-02 11:00:00'),
(2, 1, 'accepted', '2025-10-05 15:00:00');
INSERT INTO application (event_id, user_id, status, applied_at) VALUE (1, 4, 'withdrawn', '2025-10-03 15:00:00');


-- Sample Points Ledger
INSERT INTO points_ledger (user_id, delta, reason, event_id)
VALUES
(1, 10, 'Participated in Beach Cleanup', 1),
(2, 10, 'Participated in Beach Cleanup', 1),
(1, 5, 'Participated in Food Drive', 2);

-- Sample User Warnings
INSERT INTO user_warning (reporter_id, reported_user_id, event_id, reason)
VALUES
(3, 2, 1, 'No-show at Beach Cleanup'),
(3, 1, 2, 'Late arrival at Food Drive');
