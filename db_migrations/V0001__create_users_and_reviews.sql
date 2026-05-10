CREATE TABLE t_p77531067_book_review_hub.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT DEFAULT '',
  avatar VARCHAR(10) DEFAULT '🌸',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p77531067_book_review_hub.reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p77531067_book_review_hub.users(id),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(100) DEFAULT 'Fiction',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
