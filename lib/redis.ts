import { Redis } from "@upstash/redis";

// Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env.
// Set these in .env.local for local dev and in Vercel > Project > Settings > Environment Variables.
export const redis = Redis.fromEnv();
