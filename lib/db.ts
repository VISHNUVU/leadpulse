import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { getDatabaseUrl } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __leadpulsePool: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
    max: 10,
    ssl: false
  });
}

export function getPool() {
  if (!global.__leadpulsePool) {
    global.__leadpulsePool = createPool();
  }

  return global.__leadpulsePool;
}

export async function dbQuery<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values);
}

export async function dbTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
