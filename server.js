/**
 * Feniks Backend Server
 * Securely handles form submissions and Telegram API calls
 * Credentials stored in info.env (never exposed to client)
 */

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from info.env
dotenv.config({ path: './info.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, './')));

// ─── VALIDATE ENVIRONMENT ──────────────────────
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TG_TOKEN || !TG_CHAT_ID) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in info.env');
  process.exit(1);
}

// ─── CONTACT FORM ENDPOINT ─────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, city, message } = req.body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return res.status(400).json({ error: 'Phone is required' });
    }

    // Sanitize inputs (escape markdown special chars for Telegram)
    const sanitize = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/[*_`[\]()~`>#+=\-|{}.!]/g, '\\$&') // Escape Telegram markdown
        .substring(0, 1000); // Limit length
    };

    const safeName = sanitize(name);
    const safePhone = sanitize(phone);
    const safeCity = sanitize(city);
    const safeMessage = sanitize(message);

    // Format message for Telegram
    const now = new Date();
    const time = now.toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' });

    const telegramText = [
      '🔔 *Нова заявка з сайту Фенікс*',
      '',
      `👤 *Ім'я:* ${safeName}`,
      `📞 *Телефон:* ${safePhone}`,
      safeCity ? `📍 *Місто / відділення:* ${safeCity}` : '',
      safeMessage ? `💬 *Повідомлення:* ${safeMessage}` : '',
      '',
      `🕐 *Час:* ${time}`,
    ]
      .filter(Boolean)
      .join('\n');

    // Send to Telegram API
    const telegramUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: telegramText,
        parse_mode: 'Markdown',
      }),
    });

    if (!telegramResponse.ok) {
      const error = await telegramResponse.json();
      console.error('Telegram API error:', error);
      return res.status(500).json({
        error: 'Failed to send message to Telegram',
        details: error.description,
      });
    }

    // Success
    console.log(`✓ Form submitted: ${safeName} (${safePhone})`);
    res.status(200).json({
      success: true,
      message: 'Заявка успішно надіслана!',
    });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// ─── HEALTH CHECK ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── SERVE STATIC FILES ────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

// ─── START SERVER ──────────────────────────────
app.listen(PORT, () => {
  console.log(`
✓ Feniks server running on http://localhost:${PORT}
✓ Telegram credentials loaded from info.env
✓ API endpoint: POST /api/contact
  `);
});
