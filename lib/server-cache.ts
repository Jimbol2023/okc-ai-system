type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const serverCache = new Map<string, CacheEntry<unknown>>();

export async function getCachedValue<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const cached = serverCache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const value = await loader();
  serverCache.set(key, {
    expiresAt: now + ttlMs,
    value,
  });

  return value;
}

export function clearServerCacheForTests() {
  serverCache.clear();
}

export function clearServerCacheKey(key: string) {
  serverCache.delete(key);
}
