import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: "Active" });
  }

  try {
    const data = req.body;
    const rawEmail = data?.payload?.email;

    if (!rawEmail) {
      console.log("⚠️ Email не найден в данных Calendly.");
      return res.status(200).json({ status: "No email found" });
    }

    const hashedEmail = crypto.createHash('sha256').update(rawEmail.trim().toLowerCase()).digest('hex');
    const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
    const FACEBOOK_DATASET_ID = '4530724333821963';

    const fbResponse = await fetch(`https://graph.facebook.com/v18.0/${FACEBOOK_DATASET_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'system_generated',
          event_source_url: 'https://kove.services',
          user_data: {
            em: [hashedEmail]
          }
        }],
        access_token: FACEBOOK_ACCESS_TOKEN,
        test_event_code: 'TEST6399' 
      }),
    });

    const fbResult = await fbResponse.json();
    console.log("ОТВЕТ META API:", JSON.stringify(fbResult));

    if (fbResult.error) {
      console.error("❌ Ошибка Meta API:", fbResult.error.message);
      return res.status(500).json({ error: fbResult.error.message });
    }

    console.log(`✅ УСПЕХ: Лид ${rawEmail} отправлен! Meta получила событий: ${fbResult.events_received}`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
