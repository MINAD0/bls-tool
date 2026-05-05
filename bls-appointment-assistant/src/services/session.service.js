import { mkdir, readFile, stat } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function saveContextStorage(context, sessionPath) {
  await mkdir(dirname(sessionPath), { recursive: true });
  await context.storageState({ path: sessionPath });
}

export async function getSessionStatus(sessionPath) {
  try {
    const [fileStat, raw] = await Promise.all([
      stat(sessionPath),
      readFile(sessionPath, 'utf8')
    ]);
    const parsed = JSON.parse(raw);

    return {
      exists: true,
      valid: Array.isArray(parsed.cookies),
      cookieCount: Array.isArray(parsed.cookies) ? parsed.cookies.length : 0,
      updatedAt: fileStat.mtime.toISOString()
    };
  } catch {
    return {
      exists: false,
      valid: false,
      cookieCount: 0,
      updatedAt: null
    };
  }
}
