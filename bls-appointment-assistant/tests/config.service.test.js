import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  loadUserProfile,
  validateEnvironment,
  validateUserProfile
} from '../src/services/config.service.js';

test('validateUserProfile reports missing top-level and booking fields with dotted names', () => {
  const result = validateUserProfile({
    firstName: 'Example',
    lastName: '',
    passportNumber: 'AA000000',
    booking: {
      visaType: 'Schengen Visa',
      visaCategory: ''
    }
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.missingFields, [
    'lastName',
    'dateOfBirth',
    'phone',
    'email',
    'city',
    'booking.visaCategory',
    'booking.subcategory',
    'booking.applicantType',
    'booking.travelPurpose'
  ]);
});

test('validateEnvironment reports only missing required variable names', () => {
  const result = validateEnvironment({
    DEFAULT_CITY: 'casablanca',
    HEADLESS: 'false',
    TELEGRAM_BOT_TOKEN: '123456:secret'
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.missingFields, ['TELEGRAM_CHAT_ID']);
  assert.equal(JSON.stringify(result).includes('123456:secret'), false);
});

test('validateEnvironment allows Telegram values to be omitted for login setup', () => {
  const result = validateEnvironment({
    DEFAULT_CITY: 'casablanca',
    HEADLESS: 'false'
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.missingFields, []);
});

test('loadUserProfile parses a local profile JSON file', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'bls-profile-'));
  const profilePath = join(dir, 'user-profile.json');

  try {
    await writeFile(
      profilePath,
      JSON.stringify({
        firstName: 'Jane',
        lastName: 'Doe',
        passportNumber: 'AA000000',
        dateOfBirth: '1990-01-01',
        phone: '+212600000000',
        email: 'jane@example.com',
        city: 'casablanca',
        preferredDates: ['2026-05-20'],
        booking: {
          visaType: 'Schengen Visa',
          visaCategory: 'Tourism',
          subcategory: 'Short Stay',
          applicantType: 'Individual',
          travelPurpose: 'Tourism'
        }
      })
    );

    const profile = await loadUserProfile(profilePath);

    assert.equal(profile.city, 'casablanca');
    assert.equal(profile.booking.visaCategory, 'Tourism');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
