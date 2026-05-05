import test from 'node:test';
import assert from 'node:assert/strict';

import { redactSensitiveData } from '../src/utils/redact.js';

test('redactSensitiveData hides private profile values recursively', () => {
  const redacted = redactSensitiveData({
    firstName: 'Jane',
    passportNumber: 'AA000000',
    email: 'jane@example.com',
    booking: {
      visaType: 'Schengen Visa',
      visaCategory: 'Tourism'
    },
    nested: [{ phone: '+212600000000' }]
  });

  assert.equal(redacted.firstName, '[REDACTED]');
  assert.equal(redacted.passportNumber, '[REDACTED]');
  assert.equal(redacted.email, '[REDACTED]');
  assert.equal(redacted.booking.visaType, 'Schengen Visa');
  assert.equal(redacted.booking.visaCategory, 'Tourism');
  assert.equal(redacted.nested[0].phone, '[REDACTED]');
});
