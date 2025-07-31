-- Drop tables if they exist
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS applications CASCADE; 
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS status CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;

-- Create enums
CREATE TYPE role AS ENUM ('job_seeker', 'employer');
CREATE TYPE status AS ENUM ('pending', 'reviewing', 'interviewed', 'accepted', 'rejected');
CREATE TYPE activity_type AS ENUM ('sign_in', 'sign_up', 'sign_out', 'update_password', 'update_account', 'delete_account');

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role role NOT NULL DEFAULT 'job_seeker',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    location VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    salary VARCHAR(100),
    requirements TEXT,
    benefits TEXT,
    posted_by INTEGER REFERENCES users(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    status status NOT NULL DEFAULT 'pending',
    cover_letter TEXT,
    resume VARCHAR(500),
    applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action activity_type NOT NULL,
    ip_address VARCHAR(45),
    metadata TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
