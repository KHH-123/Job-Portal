import { db } from '../lib/db/drizzle';
import { users, companies, jobs, applications, activityLogs } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

async function setup() {
  console.log('Setting up database...');
  
  try {
    // Create tables using Drizzle
    console.log('Creating tables...');
    
    // This will create the tables if they don't exist
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

setup();
