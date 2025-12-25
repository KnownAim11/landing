import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запроса
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Проверяем наличие обязательных полей
  const { fullName, email, mobilePhone, industry, hasWebsite, timeline } = req.body;

  if (!fullName || !email || !mobilePhone) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: fullName, email, mobilePhone' 
    });
  }

  // Настройка транспорта (Gmail SMTP)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true для порта 465
    auth: {
      user: process.env.EMAIL_USER, // Ваш Gmail адрес
      pass: process.env.EMAIL_PASS, // Пароль приложения Gmail (App Password)
    },
  });

  try {
    // Формируем текст письма
    const emailText = `Новая заявка на создание сайта

Имя: ${fullName}
Email: ${email}
Телефон: ${mobilePhone}
Отрасль: ${industry || 'Not specified'}
Есть сайт: ${hasWebsite || 'Not specified'}
Сроки: ${timeline || 'Not specified'}
Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

---
Это автоматическое уведомление с вашего сайта.`;

    // Отправляем письмо на max@kove.one
    await transporter.sendMail({
      from: `"Kove Media Website" <${process.env.EMAIL_USER}>`,
      to: 'max@kove.one',
      replyTo: email, // Чтобы можно было ответить клиенту
      subject: `Новая заявка с сайта: ${fullName}`,
      text: emailText,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    });
  }
}


