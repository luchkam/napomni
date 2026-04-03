const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/subscribe', async (req, res) => {
  const { phone, email } = req.body;

  const hasPhone = phone && phone.trim();
  const hasEmail = email && email.trim();

  if (!hasPhone && !hasEmail) {
    return res.status(400).json({ success: false, error: 'Phone or email is required' });
  }

  const text = `🆕 Новая заявка NAPOMNI!\n📱 Телефон: ${hasPhone ? phone : 'не указан'}\n📧 Email: ${hasEmail ? email : 'не указан'}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    res.json({ success: true });
  } catch (err) {
    process.stdout.write('Error: ' + err.message + '\n');
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => process.stdout.write(`Server running on port ${PORT}\n`));
