-- CrowdMap Database Schema

-- Enable PostGIS extension for spatial queries (optional)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    color VARCHAR(7)
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_location_coords ON locations(latitude, longitude);
CREATE INDEX idx_location_category ON locations(category_id);
CREATE INDEX idx_location_user ON locations(user_id);
CREATE INDEX idx_comment_location ON comments(location_id);
CREATE INDEX idx_photo_location ON photos(location_id);

-- Insert default categories
INSERT INTO categories (name, icon, color) VALUES 
    ('Tuvalet', '🚽', '#4CAF50'),
    ('ATM', '🏧', '#2196F3'),
    ('Otopark', '🅿️', '#FF9800'),
    ('WiFi', '📶', '#9C27B0'),
    ('Şarj İstasyonu', '🔌', '#F44336'),
    ('Güvenli Alan', '🛡️', '#00BCD4'),
    ('Fotoğraf Noktası', '📸', '#FFEB3B'),
    ('Tehlikeli Bölge', '⚠️', '#F44336'),
    ('Su Kaynağı', '💧', '#03A9F4'),
    ('Kamp Alanı', '🏕️', '#8BC34A')
ON CONFLICT (name) DO NOTHING;

-- Admin user should be created manually with secure credentials
-- Example: INSERT INTO users (username, email, password, role) VALUES ('your-admin', 'your-email', 'bcrypt-hash', 'ADMIN');