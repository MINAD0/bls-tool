# BLS Appointment Assistant

Safe first slice for local configuration and manual BLS login/session saving.

## Stack

- Node.js
- Playwright
- dotenv
- Pino
- Plain JSON configuration

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install the Playwright browser:

   ```bash
   npx playwright install chromium
   ```

3. Create local environment config:

   ```bash
   cp .env.example .env
   ```

4. Create your local profile:

   ```bash
   cp config/user-profile.example.json config/user-profile.json
   ```

5. Edit `.env` and `config/user-profile.json`.

6. Validate setup:

   ```bash
   npm run setup
   ```

7. Log in manually and save the session:

   ```bash
   npm run login
   ```

8. Check the saved session:

   ```bash
   npm run check:session
   ```

## Safety

The tool does not bypass CAPTCHA or OTP. It opens the official BLS page in a visible browser and waits while you complete security steps manually.

Private files are ignored by Git:

- `.env`
- `config/user-profile.json`
- `config/proxies.json`
- `storage/session.json`
- `logs/`
