export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: "Active" });
  }

  // Это покажет нам реальную структуру данных в логах Vercel
  console.log("ПОЛУЧЕНЫ ДАННЫЕ ОТ CALENDLY:", JSON.stringify(req.body, null, 2));

  try {
    const payload = req.body?.payload;
    
    // ПРОВЕРЯЕМ ОБА ВАРИАНТА ПУТИ К EMAIL
    const inviteeEmail = payload?.email || payload?.invitee?.email;

    if (!inviteeEmail) {
      console.log("⚠️ Email не найден. Проверьте структуру в логе выше.");
      return res.status(200).json({ status: "No email data" });
    }

    const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
    const FACEBOOK_DATASET_ID = '4530724333821963';

    await fetch(`https://graph.facebook.com/v17.0/${FACEBOOK_DATASET_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'system_generated',
          user_data: { em: [inviteeEmail] }
        }],
        access_token: FACEBOOK_ACCESS_TOKEN
      }),
    });

    console.log(`✅ УСПЕХ: Данные для ${inviteeEmail} отправлены в Meta!`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ ОШИБКА API:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

