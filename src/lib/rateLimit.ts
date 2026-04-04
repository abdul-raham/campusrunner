type RateLimitState = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitState>();

export const rateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const state = store.get(key);
  if (!state || now > state.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (state.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: state.resetAt };
  }

  state.count += 1;
  store.set(key, state);
  return { allowed: true, remaining: limit - state.count, resetAt: state.resetAt };
};
