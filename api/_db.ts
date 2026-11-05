import { Client } from 'pg';
import dns from 'dns';

// DNS resolver cache for local Windows environments if needed
let clusterIpCache: string | null = null;

async function getNeonClient(): Promise<Client> {
  let connStr = (process.env.DATABASE_URL || '').trim();
  // Strip outer quotes if any
  connStr = connStr.replace(/^["']+|["']+$/g, '');

  if (!connStr) {
    throw new Error('DATABASE_URL environment variable is not configured');
  }

  // On Linux / Vercel Edge/Serverless, standard connectionString works out-of-the-box
  if (process.platform !== 'win32') {
    const client = new Client({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false
      }
    });
    await client.connect();
    return client;
  }

  // On local Windows dev, parse URL dynamically from process.env.DATABASE_URL
  const parsed = new URL(connStr.replace('postgresql://', 'http://'));
  const rawHost = parsed.hostname;
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  const database = parsed.pathname.replace('/', '') || 'neondb';

  if (!clusterIpCache) {
    clusterIpCache = await new Promise<string>((resolve) => {
      dns.resolve4(rawHost, (err, addrs) => {
        if (!err && addrs && addrs.length > 0) return resolve(addrs[0]);
        dns.resolve4('c-4.ap-southeast-1.aws.neon.tech', (err2, clusterAddrs) => {
          if (!err2 && clusterAddrs && clusterAddrs.length > 0) return resolve(clusterAddrs[0]);
          resolve('52.76.212.156');
        });
      });
    });
  }

  const client = new Client({
    host: clusterIpCache,
    port: parseInt(parsed.port || '5432'),
    user,
    password,
    database,
    ssl: {
      rejectUnauthorized: false,
      servername: rawHost
    }
  });

  await client.connect();
  return client;
}

export async function queryNeon<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const client = await getNeonClient();
  try {
    const res = await client.query(sql, params);
    return res.rows as T[];
  } finally {
    await client.end().catch(() => {});
  }
}
