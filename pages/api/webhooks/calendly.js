export default async function handler(req, res) {
  // 1. Проверяем, что это POST-запрос (от Calendly)
  if (req.method !== 'POST') {
    return res.status(200).json({ message: "Webhook is active. Waiting for Calendly POST request." });
  }

  try {
    const body = req.body;
    
    // 2. Безопасно достаем email с проверкой (защита от вашей ошибки)
    const inviteeEmail = body.payload?.invitee?.email;

    if (!inviteeEmail) {
      console.log("No invitee email found in payload");
      return res.status(200).json({ status: "No data to send" });
    }

    const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
    const FACEBOOK_DATASET_ID = '4530724333821963';

    // 3. Отправляем данные в Meta
    const fbResponse = await fetch(`https://graph.facebook.com/v17.0/${FACEBOOK_DATASET_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'system_generated',
          user_data: {
            em: [inviteeEmail] // Отправляем найденный email
          }
        }],
        access_token: FACEBOOK_ACCESS_TOKEN
      }),
    });

    console.log(`Event sent to Meta for: ${inviteeEmail}`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
  }
}


