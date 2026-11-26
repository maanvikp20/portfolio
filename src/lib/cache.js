import { unstable_cache, revalidateTag } from "next/cache";

// every cached public read carries this tag, so one call refreshes them all
export const CONTENT_TAG = "content";

// safety net: even if a refresh were missed, data is re-read at least hourly
const MAX_AGE_SECONDS = 3600;

// wrap a database read so repeat visits are served from cache
export const cached = (fn, keyParts) =>
  unstable_cache(fn, keyParts, {
    tags: [CONTENT_TAG],
    revalidate: MAX_AGE_SECONDS,
  });

// call after any admin save/delete so the site shows the change right away
export const revalidateContent = () =>
  revalidateTag(CONTENT_TAG, { expire: 0 });