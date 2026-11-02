// Tests share one module graph per worker (`isolate: false`), so restore
// `process.env` after each file in case a test does not clean up after itself.
import { afterAll } from "vitest";

const snapshot = { ...process.env };

afterAll(() => {
  for (const key of Object.keys(process.env))
    if (!(key in snapshot)) Reflect.deleteProperty(process.env, key);
  Object.assign(process.env, snapshot);
});
