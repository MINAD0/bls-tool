import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
export const projectRoot = resolve(currentDir, '../..');

export const paths = {
  projectRoot,
  env: join(projectRoot, '.env'),
  profile: join(projectRoot, 'config', 'user-profile.json'),
  session: join(projectRoot, 'storage', 'session.json'),
  userDataDir: join(projectRoot, 'storage', 'user-data'),
  logFile: join(projectRoot, 'logs', 'app.log')
};
