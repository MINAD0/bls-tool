const SENSITIVE_KEYS = new Set([
  'firstname',
  'lastname',
  'passportnumber',
  'dateofbirth',
  'phone',
  'email',
  'telegram_bot_token',
  'telegram_chat_id',
  'token',
  'password'
]);

export function redactSensitiveData(value) {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (SENSITIVE_KEYS.has(key.toLowerCase())) {
          return [key, '[REDACTED]'];
        }

        return [key, redactSensitiveData(item)];
      })
    );
  }

  return value;
}
