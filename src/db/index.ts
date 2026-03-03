import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For Neon PostgreSQL with connection pooling
// The connection string should include ?sslmode=require
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Please configure your environment variables.');
}

// Create a postgres client with connection pooling settings for serverless
const queryClient = postgres(connectionString, {
  max: 1, // Important for serverless - limits connections per function invocation
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

// Create drizzle instance
export const db = drizzle(queryClient, { schema });

// Export types for use in the application
export type Database = typeof db;
export { schema };
