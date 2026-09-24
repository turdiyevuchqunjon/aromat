import { Redis } from "@upstash/redis";
import type { LeadRecord } from "./types";

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN sozlanmagan. .env faylini tekshiring."
      );
    }
    redisClient = new Redis({ url, token });
  }
  return redisClient;
}

const LEAD_KEY = (id: string) => `lead:${id}`;
const TOKEN_INDEX_KEY = (token: string) => `lead:token:${token}`;

export async function saveLead(lead: LeadRecord): Promise<void> {
  const redis = getRedis();
  await redis.set(LEAD_KEY(lead.id), JSON.stringify(lead));
  await redis.set(TOKEN_INDEX_KEY(lead.token), lead.id);
}

export async function getLeadByToken(token: string): Promise<LeadRecord | null> {
  const redis = getRedis();
  const id = await redis.get<string>(TOKEN_INDEX_KEY(token));
  if (!id) return null;
  const raw = await redis.get<string | LeadRecord>(LEAD_KEY(id));
  if (!raw) return null;
  return typeof raw === "string" ? (JSON.parse(raw) as LeadRecord) : raw;
}

export async function updateLead(lead: LeadRecord): Promise<void> {
  const redis = getRedis();
  await redis.set(LEAD_KEY(lead.id), JSON.stringify(lead));
}
