import test from 'node:test';
import assert from 'node:assert/strict';

import { pageLooksLoggedOut } from '../src/services/browser.service.js';

test('pageLooksLoggedOut does not rely on the login URL alone', async () => {
  const result = await pageLooksLoggedOut(fakePage({
    url: 'https://www.blsspainmorocco.net/MAR/account/login',
    bodyText: 'Welcome back',
    passwordCount: 0
  }));

  assert.equal(result, false);
});

test('pageLooksLoggedOut detects a visible password input', async () => {
  const result = await pageLooksLoggedOut(fakePage({
    url: 'https://www.blsspainmorocco.net/MAR/account/login',
    bodyText: 'Password',
    passwordCount: 1
  }));

  assert.equal(result, true);
});

function fakePage({ url, bodyText, passwordCount }) {
  return {
    url: () => url,
    locator: (selector) => {
      if (selector === 'body') {
        return {
          innerText: async () => bodyText
        };
      }

      return {
        count: async () => passwordCount
      };
    }
  };
}
