import test from "node:test";
import assert from "node:assert/strict";
import { excerptFrom } from "../src/lib/markdown.js";
import { optimizeImage } from "../src/lib/images.js";
import { rateLimit } from "../src/lib/rateLimit.js";

test("excerptFrom strips Markdown down to plain text", () => {
  const md =
    "# Title\n\nSome **bold** text with a [link](https://x.dev) and `code`.\n\n```js\nignored()\n```";
  assert.equal(excerptFrom(md), "Title Some bold text with a link and code.");
});

test("excerptFrom truncates long text with an ellipsis", () => {
  const out = excerptFrom("word ".repeat(100), 20);
  assert.ok(out.length <= 21);
  assert.ok(out.endsWith("…"));
});

test("optimizeImage adds Cloudinary sizing once", () => {
  const url = "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg";
  const once = optimizeImage(url, 800);
  assert.equal(
    once,
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/v1/sample.jpg",
  );
  assert.equal(optimizeImage(once, 400), once);
});

test("optimizeImage leaves other URLs and non-strings alone", () => {
  assert.equal(
    optimizeImage("https://example.com/a.jpg"),
    "https://example.com/a.jpg",
  );
  assert.equal(optimizeImage(undefined), undefined);
});

test("rateLimit blocks after the limit, per key", () => {
  const opts = { limit: 2, windowMs: 60_000 };
  assert.equal(rateLimit("t:a", opts).ok, true);
  assert.equal(rateLimit("t:a", opts).ok, true);
  const blocked = rateLimit("t:a", opts);
  assert.equal(blocked.ok, false);
  assert.ok(blocked.retryAfter > 0);
  assert.equal(rateLimit("t:b", opts).ok, true);
});
