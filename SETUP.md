# Feniks Setup Guide

## Security Changes

The Telegram Bot API token is no longer hardcoded in the frontend. Instead, it's stored securely in environment variables on the backend.

### ✓ What Changed
- ❌ Removed hardcoded `TG_TOKEN` from `main.js`
- ❌ Removed hardcoded `TG_CHAT_ID` from `main.js`
- ✅ Added `server.js` with secure backend endpoint
- ✅ Created `.gitignore` to prevent committing `info.env`
- ✅ Added `package.json` for Node.js dependencies

## Installation

### 1. Install Node.js (if not already installed)
[Download Node.js](https://nodejs.org/) - LTS version recommended

### 2. Copy Environment Variables
```bash
# Copy the example file to create your actual secrets file
cp info.env.example info.env
```

### 3. Edit `info.env` with Your Credentials
```bash
# Open info.env and add your actual Telegram bot credentials
# DO NOT commit this file to git!
TELEGRAM_BOT_TOKEN=your_actual_token_here
TELEGRAM_CHAT_ID=your_actual_chat_id_here
```

### 4. Install Dependencies
```bash
npm install
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## How It Works

### Frontend (Browser)
1. User fills out contact form
2. Form data is sent to backend endpoint: `POST /api/contact`
3. Backend validates and sanitizes input
4. Backend sends message to Telegram (token never exposed to client)
5. User sees success/error message

### Backend (Node.js)
1. Receives form data from frontend
2. Validates all inputs
3. Loads `TELEGRAM_BOT_TOKEN` from `info.env` (secure, not in code)
4. Calls Telegram Bot API server-to-server
5. Returns success/error response to frontend

### Security Benefits
- ✅ Telegram token hidden from browser/network
- ✅ Token never exposed in page source
- ✅ Token not sent in network requests
- ✅ Server-side input validation and sanitization
- ✅ Rate limiting possible on backend
- ✅ Easy to rotate token without changing code

## Deployment

### Local Development
```bash
npm run dev
# Visit http://localhost:3000
```

### Production (e.g., Heroku, Railway, Render)
1. Push code to your git repository (info.env is in .gitignore, so it won't be committed)
2. Set environment variables on hosting platform:
   ```
   TELEGRAM_BOT_TOKEN=your_token
   TELEGRAM_CHAT_ID=your_chat_id
   NODE_ENV=production
   PORT=3000
   ```
3. Platform will run `npm start` automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Set environment variables when running the container.

## API Endpoints

### POST /api/contact
Send a contact form submission

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+380123456789",
  "city": "Kyiv",
  "message": "Optional message"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Заявка успішно надіслана!"
}
```

**Response (Error):**
```json
{
  "error": "Name is required"
}
```

### GET /api/health
Health check endpoint for monitoring

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Troubleshooting

### "TELEGRAM_BOT_TOKEN not found"
- Make sure you created `info.env` (not `info.env.example`)
- Check that the file path is correct
- Verify credentials are in the file

### Form not submitting
- Check browser console for errors (F12 → Console)
- Verify server is running (`npm run dev`)
- Make sure backend URL is `/api/contact` (not full URL)

### Telegram token rejected
- Token may be expired or revoked
- Generate new token from BotFather on Telegram
- Update `info.env` with new token

## Additional Notes

- `info.env` is in `.gitignore` - it will never be committed to git
- Keep `info.env` secure and never share it
- Use different tokens for dev/prod environments
- Monitor Telegram chat for suspicious messages (sign of token leak)
- Consider adding rate limiting to `/api/contact` in production
