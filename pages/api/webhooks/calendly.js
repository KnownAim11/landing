export default async function handler(req, res) {
  // 1. Защита от открытия в браузере: разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(200).json({ 
      status: "Active", 
      message: "Webhook is working. Send a POST request from Calendly to trigger it." 
    });
  }

  try {
    // 2. Безопасное получение данных с помощью опциональной цепочки (?.)
    const payload = req.body?.payload;
    const inviteeEmail = payload?.invitee?.email;

    // 3. Если данных нет, просто выходим без ошибки
    if (!inviteeEmail) {
      console.log("⚠️ Получен пустой POST-запрос или формат данных неверный.");
      return res.status(200).json({ status: "No email data found" });
    }

    // 4. Параметры Meta (Проверьте, что TOKEN добавлен в Settings -> Environment Variables)
    const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
    const FACEBOOK_DATASET_ID = '4530724333821963';

    const fbResponse = await fetch(`https://graph.facebook.com/v17.0/${FACEBOOK_DATASET_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'system_generated',
          user_data: {
            em: [inviteeEmail] 
          }
        }],
        access_token: FACEBOOK_ACCESS_TOKEN
      }),
    });

    console.log(`✅ Данные успешно отправлены в Meta для: ${inviteeEmail}`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Ошибка в обработчике вебхука:", error.message);
    return res.status(500).json({ error: error.message });
  }
}


