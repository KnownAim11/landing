import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: "Active" });
  }

  try {
    const data = req.body;
    // Точный путь из ваших логов: payload.email
    const rawEmail = data?.payload?.email;

    if (!rawEmail) {
      console.log("⚠️ Email не найден в payload. Проверьте структуру данных.");
      return res.status(200).json({ status: "No email found" });
    }

    // Хешируем email для Meta (обязательное требование Facebook API)
    const hashedEmail = crypto.createHash('sha256').update(rawEmail.trim().toLowerCase()).digest('hex');

    const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
    const FACEBOOK_DATASET_ID = '4530724333821963';

    const fbResponse = await fetch(`https://graph.facebook.com/v11.0/${FACEBOOK_DATASET_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'system_generated',
          user_data: {
            em: [hashedEmail]
          }
        }],
        access_token: FACEBOOK_ACCESS_TOKEN
      }),
    });

    const fbResult = await fbResponse.json();

    if (fbResult.error) {
      console.error("❌ Ошибка Meta API:", fbResult.error.message);
      return res.status(500).json({ error: fbResult.error.message });
    }

    console.log(`✅ УСПЕХ: Лид ${rawEmail} отправлен в Meta!`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
    console.error("❌ ОШИБКА:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
