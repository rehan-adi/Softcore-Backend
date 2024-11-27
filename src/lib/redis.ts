import { createClient } from "redis"

export const client = createClient ({
  url : process.env.REDIS_URL
});

client.on("error", function(err: unknown) {
  throw err;
});

await client.connect()
await client.set('foo','bar');