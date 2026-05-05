import pino from 'pino';

import { paths } from '../utils/paths.js';

export function createAppLogger() {
  return pino(
    {
      level: process.env.LOG_LEVEL ?? 'info',
      redact: {
        paths: [
          'firstName',
          'lastName',
          'passportNumber',
          'dateOfBirth',
          'phone',
          'email',
          '*.firstName',
          '*.lastName',
          '*.passportNumber',
          '*.dateOfBirth',
          '*.phone',
          '*.email',
          'TELEGRAM_BOT_TOKEN',
          'TELEGRAM_CHAT_ID'
        ],
        censor: '[REDACTED]'
      }
    },
    pino.destination({
      dest: paths.logFile,
      mkdir: true,
      sync: false
    })
  );
}
