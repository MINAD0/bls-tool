import {
  loadEnvironment,
  loadUserProfile,
  validateEnvironment,
  validateUserProfile
} from '../services/config.service.js';
import { createAppLogger } from '../services/logger.service.js';
import { getSessionStatus } from '../services/session.service.js';
import { paths } from '../utils/paths.js';

const logger = createAppLogger();

async function main() {
  const env = await loadEnvironment(paths.env);
  const envResult = validateEnvironment(env);

  let profile;
  let profileResult = {
    valid: false,
    missingFields: ['config/user-profile.json']
  };

  try {
    profile = await loadUserProfile(paths.profile);
    profileResult = validateUserProfile(profile);
  } catch (error) {
    logger.warn({ error: error.message }, 'user profile could not be loaded');
  }

  const sessionStatus = await getSessionStatus(paths.session);

  if (envResult.valid && profileResult.valid) {
    logger.info({ sessionExists: sessionStatus.exists }, 'setup validation passed');
    console.log('Setup looks good.');
    console.log(sessionStatus.valid ? 'Saved session found.' : 'No saved session yet. Run `npm run login` next.');
    return;
  }

  logger.warn(
    {
      missingEnvironment: envResult.missingFields,
      missingProfile: profileResult.missingFields
    },
    'setup validation failed'
  );

  console.log('Setup needs attention.');

  if (!envResult.valid) {
    console.log(`Missing .env values: ${envResult.missingFields.join(', ')}`);
    console.log('Create `.env` from `.env.example` and fill the required values.');
  }

  if (!profileResult.valid) {
    console.log(`Missing profile values: ${profileResult.missingFields.join(', ')}`);
    console.log('Create `config/user-profile.json` from `config/user-profile.example.json`.');
  }

  process.exitCode = 1;
}

main().catch((error) => {
  logger.error({ error }, 'setup failed');
  console.error(`Setup failed: ${error.message}`);
  process.exitCode = 1;
});
