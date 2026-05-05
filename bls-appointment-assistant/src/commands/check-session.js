import { loadEnvironment } from '../services/config.service.js';
import { createAppLogger } from '../services/logger.service.js';
import { getSessionStatus } from '../services/session.service.js';
import { launchPersistentContext, openOrReusePage, pageLooksLoggedOut } from '../services/browser.service.js';
import { paths } from '../utils/paths.js';

const logger = createAppLogger();

async function main() {
  const env = await loadEnvironment(paths.env);
  const sessionStatus = await getSessionStatus(paths.session);

  if (!sessionStatus.exists || !sessionStatus.valid) {
    logger.warn({ sessionStatus }, 'session missing or invalid');
    console.log('No valid saved session found. Run `npm run login` first.');
    process.exitCode = 1;
    return;
  }

  const context = await launchPersistentContext({
    headless: env.HEADLESS === 'true',
    userDataDir: paths.userDataDir,
    logger
  });

  try {
    const page = await openOrReusePage(context, env.BLS_LOGIN_URL);
    await page.waitForLoadState('domcontentloaded', {
      timeout: Number(env.SESSION_CHECK_TIMEOUT_MS)
    }).catch(() => undefined);

    const loggedOut = await pageLooksLoggedOut(page);

    if (loggedOut) {
      logger.warn('session appears expired');
      console.log('Session appears expired. Run `npm run login` again.');
      process.exitCode = 1;
      return;
    }

    logger.info('session appears valid');
    console.log('Session appears valid.');
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  logger.error({ error }, 'check-session failed');
  console.error(`Session check failed: ${error.message}`);
  process.exitCode = 1;
});
