import AsyncStorage from '@react-native-async-storage/async-storage';

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitState = {
  allowed: boolean;
  retryAfterMs: number;
};

const PREFIX = 'stayventory-rate-limit';

function buildKey(key: string) {
  return `${PREFIX}:${key}`;
}

function formatDurationPart(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

export function formatRetryAfter(ms: number) {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000));

  if (totalSeconds < 60) {
    return formatDurationPart(totalSeconds, 'second');
  }

  const minutes = Math.ceil(totalSeconds / 60);

  if (minutes < 60) {
    return formatDurationPart(minutes, 'minute');
  }

  const hours = Math.ceil(minutes / 60);
  return formatDurationPart(hours, 'hour');
}

async function readHits(key: string) {
  const raw = await AsyncStorage.getItem(buildKey(key));

  if (!raw) {
    return [] as number[];
  }

  try {
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isFinite(value)) : [];
  } catch {
    return [];
  }
}

async function writeHits(key: string, hits: number[]) {
  await AsyncStorage.setItem(buildKey(key), JSON.stringify(hits));
}

function pruneHits(hits: number[], windowMs: number, now: number) {
  return hits.filter((timestamp) => now - timestamp < windowMs);
}

export async function getRateLimitState(key: string, options: RateLimitOptions): Promise<RateLimitState> {
  const now = Date.now();
  const hits = pruneHits(await readHits(key), options.windowMs, now);

  if (hits.length < options.limit) {
    return { allowed: true, retryAfterMs: 0 };
  }

  const retryAfterMs = options.windowMs - (now - hits[0]);
  return { allowed: false, retryAfterMs: Math.max(1000, retryAfterMs) };
}

export async function recordRateLimitHit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const nextHits = [...pruneHits(await readHits(key), options.windowMs, now), now];
  await writeHits(key, nextHits);
}

export async function clearRateLimit(key: string) {
  await AsyncStorage.removeItem(buildKey(key));
}
