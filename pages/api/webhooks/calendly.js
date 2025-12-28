export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: "Active" });
  }

  // 1. Попытка прочитать данные
  let data = req.body;
  
  // Если тело пустое, пробуем прочитать его как текст (иногда это помогает)
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch (e) { console.log("Ошибка парсинга строки"); }
  }

  // 2. ГЛУБОКОЕ ЛОГИРОВАНИЕ (чтобы мы точно увидели, что прислал Calendly)
  console.log("--- ПОЛУЧЕННЫЙ ОБЪЕКТ ---");
  console.log(JSON.stringify(data, null, 2));

  try {
    // 3. Расширенный поиск Email (Calendly может менять структуру)
    const email = data?.payload?.email || 
                  data?.payload?.invitee?.email || 
                  data?.invitee?.email ||
                  data?.email;

    if (!email) {
      console.log("⚠️ EMAIL ВСЕ ЕЩЕ НЕ НАЙДЕН. Раскройте лог выше, чтобы увидеть структуру.");
      return res.status(200).json({ status: "Waiting for data" });
    }

    const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
    const FACEBOOK_DATASET_ID = '4530724333821963';

    // 4. Отправка в Meta
    await fetch(`https://graph.facebook.com/v17.0/${FACEBOOK_DATASET_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'system_generated',
          user_data: { em: [email] }
        }],
        access_token: FACEBOOK_ACCESS_TOKEN
      }),
    });

    console.log(`✅ УСПЕХ: Лид ${email} отправлен в Meta!`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ ОШИБКА:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
