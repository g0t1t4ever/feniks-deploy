# Quick Start

## 30-Second Setup

```bash
# 1. Copy environment variables
cp info.env.example info.env

# 2. Edit info.env - add your Telegram credentials
# (Open in any text editor and paste your token & chat ID)

# 3. Install & run
npm install
npm run dev

# 4. Visit http://localhost:3000
```

That's it! 🚀

### In Production

Set these environment variables on your hosting platform:
- `TELEGRAM_BOT_TOKEN` - Your bot token
- `TELEGRAM_CHAT_ID` - Your chat ID

No need to manage `info.env` on the server—the platform handles it.

### More Details
See [SETUP.md](./SETUP.md) for detailed configuration and deployment guides.
