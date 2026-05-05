import { chromium } from 'playwright';

export async function launchPersistentContext({ headless, userDataDir, logger }) {
  logger?.info({ headless }, 'launching persistent browser context');

  return chromium.launchPersistentContext(userDataDir, {
    headless,
    locale: 'en-US',
    timezoneId: 'Africa/Casablanca',
    viewport: {
      width: 1366,
      height: 768
    },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=WebRtcHideLocalIpsWithMdns',
      '--force-webrtc-ip-handling-policy=disable_non_proxied_udp'
    ]
  });
}

export async function openOrReusePage(context, url) {
  const page = context.pages()[0] ?? await context.newPage();
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  return page;
}

export async function pageLooksLoggedOut(page) {
  const url = page.url().toLowerCase();
  const bodyText = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '');
  const passwordInputs = await page.locator('input[type="password"]').count().catch(() => 0);
  const loginPattern = /\b(login|sign in|connexion|se connecter|password|mot de passe)\b/i;
  const onLoginPath = url.includes('/account/login');

  return passwordInputs > 0 || (onLoginPath && loginPattern.test(bodyText));
}
