CREATE DATABASE IF NOT EXISTS SMUUTH_Events;
use SMUUTH_Events;
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('helper','admin') NOT NULL,
  points INT DEFAULT 0,
  certifications JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS event (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  organiser_user_id INT NOT NULL,
  location_name VARCHAR(255),
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  address TEXT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME,
  required_pax INT DEFAULT 1,
  reward_amount DECIMAL(8,2) DEFAULT 0,
  requirement_tags JSON DEFAULT NULL,
  status ENUM('open','closed','completed','cancelled') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organiser_user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS application (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('applied','accepted','rejected','withdrawn','no_show','completed') DEFAULT 'applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  withdrawn_at DATETIME NULL,
  rating TINYINT NULL,
  feedback TEXT NULL,
  FOREIGN KEY (event_id) REFERENCES event(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS points_ledger (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  delta INT NOT NULL,
  reason VARCHAR(255),
  event_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE IF NOT EXISTS user_warning (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL,
  reported_user_id INT NOT NULL,
  event_id INT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved BOOLEAN DEFAULT FALSE
);

DELIMITER $$

CREATE TRIGGER trg_award_points_after_event_completed
AFTER UPDATE ON event
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN

        INSERT INTO points_ledger (user_id, delta, reason, event_id, created_at)
        SELECT a.user_id, NEW.reward_amount, CONCAT('Points for event ', NEW.title), NEW.id, NOW()
        FROM application a
        LEFT JOIN user_warning w
            ON a.user_id = w.reported_user_id
            AND w.event_id = NEW.id
            AND w.resolved = FALSE
        WHERE a.event_id = NEW.id
          AND a.status = 'accepted'
          AND w.id IS NULL;

        UPDATE user u
        JOIN application a ON u.id = a.user_id
        LEFT JOIN user_warning w
            ON a.user_id = w.reported_user_id
            AND w.event_id = NEW.id
            AND w.resolved = FALSE
        SET u.points = u.points + NEW.reward_amount
        WHERE a.event_id = NEW.id
          AND a.status = 'accepted'
          AND w.id IS NULL;

        UPDATE application a
        LEFT JOIN user_warning w
            ON a.user_id = w.reported_user_id
            AND w.event_id = NEW.id
            AND w.resolved = FALSE
        SET a.status = 'completed'
        WHERE a.event_id = NEW.id
          AND a.status = 'accepted'
          AND w.id IS NULL;

    END IF;
END$$

DELIMITER ;

