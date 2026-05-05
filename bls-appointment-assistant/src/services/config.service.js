import { readFile } from 'node:fs/promises';

import dotenv from 'dotenv';

export const DEFAULT_BLS_LOGIN_URL = 'https://www.blsspainmorocco.net/MAR/account/login';

const REQUIRED_PROFILE_FIELDS = [
  'firstName',
  'lastName',
  'passportNumber',
  'dateOfBirth',
  'phone',
  'email',
  'city',
  'booking.visaType',
  'booking.visaCategory',
  'booking.subcategory',
  'booking.applicantType',
  'booking.travelPurpose'
];

export async function loadEnvironment(envPath) {
  const fileValues = await readFile(envPath, 'utf8')
    .then((content) => dotenv.parse(content))
    .catch(() => ({}));

  return {
    BLS_LOGIN_URL: DEFAULT_BLS_LOGIN_URL,
    DEFAULT_CITY: 'casablanca',
    HEADLESS: 'false',
    EMAIL_HELPER_URL: '',
    SESSION_CHECK_TIMEOUT_MS: '15000',
    ...fileValues,
    ...process.env
  };
}

export async function loadUserProfile(profilePath) {
  const raw = await readFile(profilePath, 'utf8');
  return JSON.parse(raw);
}

export function validateEnvironment(env) {
  const missingFields = [];
  const hasTelegramToken = hasValue(env.TELEGRAM_BOT_TOKEN);
  const hasTelegramChatId = hasValue(env.TELEGRAM_CHAT_ID);

  if (hasTelegramToken && !hasTelegramChatId) {
    missingFields.push('TELEGRAM_CHAT_ID');
  }

  if (hasTelegramChatId && !hasTelegramToken) {
    missingFields.push('TELEGRAM_BOT_TOKEN');
  }

  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

export function validateUserProfile(profile) {
  const missingFields = REQUIRED_PROFILE_FIELDS.filter((field) => !hasValue(getPath(profile, field)));

  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

function getPath(value, path) {
  return path.split('.').reduce((current, part) => current?.[part], value);
}

function hasValue(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null;
}
