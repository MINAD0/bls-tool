import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { loadEnvironment } from '../services/config.service.js';
import { createAppLogger } from '../services/logger.service.js';
import { saveContextStorage } from '../services/session.service.js';
import { launchPersistentContext, openOrReusePage } from '../services/browser.service.js';
import { paths } from '../utils/paths.js';

const logger = createAppLogger();

async function waitForEnter(message) {
  const rl = createInterface({ input, output });
  try {
    await rl.question(message);
  } finally {
    rl.close();
  }
}

async function main() {
  const env = await loadEnvironment(paths.env);
  const context = await launchPersistentContext({
    headless: false,
    userDataDir: paths.userDataDir,
    logger
  });

  try {
    const page = await openOrReusePage(context, env.BLS_LOGIN_URL);
    await page.waitForLoadState('domcontentloaded', {
      timeout: Number(env.SESSION_CHECK_TIMEOUT_MS)
    }).catch(() => undefined);

    console.log('BLS login page opened.');
    console.log('Complete login, CAPTCHA, and OTP manually in the browser.');

    if (env.EMAIL_HELPER_URL) {
      console.log(`Manual email helper URL configured: ${env.EMAIL_HELPER_URL}`);
    }

    await waitForEnter('Press Enter here after you are fully logged in and ready to save the session...');
    await saveContextStorage(context, paths.session);

    logger.info('session saved');
    console.log(`Session saved to ${paths.session}`);
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  logger.error({ error }, 'login failed');
  console.error(`Login failed: ${error.message}`);
  process.exitCode = 1;
});
