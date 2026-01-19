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

  const { name, email, phone, industry } = req.body;

  if (!name || !email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: name, email' 
    });
  }

  try {
    // Используем Resend API для отправки красивого HTML письма
    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_WBJZjiDR_FvmHBTW2iMGvuUgszzcfXc5j';
    
    console.log('Attempting to send email to:', email);
    console.log('Using Resend API key:', RESEND_API_KEY ? 'Present' : 'Missing');
    
    const emailHTML = getThankYouEmailHTML(name, industry);
    const emailText = getThankYouEmailText(name, industry);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Kove Media <onboarding@resend.dev>',
        to: email,
        replyTo: 'max@kove.one',
        subject: 'Thank You - Kove Media',
        html: emailHTML,
        text: emailText
      })
    });

    const responseData = await response.json();
    console.log('Resend API response:', responseData);

    if (!response.ok) {
      console.error('Resend API error:', responseData);
      // Fallback: попробуем отправить через FormSubmit напрямую
      try {
        const formData = new URLSearchParams();
        formData.append('_to', email);
        formData.append('_subject', 'Thank You - Kove Media');
        formData.append('_autoresponse', emailText);
        
        const formSubmitResponse = await fetch('https://formsubmit.co/ajax/max@kove.one', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString()
        });
        
        if (formSubmitResponse.ok) {
          return res.status(200).json({ 
            success: true, 
            note: 'Email sent via FormSubmit fallback',
            resendError: responseData
          });
        }
      } catch (fallbackError) {
        console.error('FormSubmit fallback also failed:', fallbackError);
      }
      
      return res.status(200).json({ 
        success: false, 
        note: 'Email sending failed, but FormSubmit will send basic autoresponse',
        error: responseData
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Thank you email sent successfully via Resend',
      emailId: responseData.id
    });

  } catch (error) {
    console.error('Email sending error:', error);
    // Не возвращаем ошибку, чтобы не блокировать форму
    // FormSubmit все равно отправит базовый автоответ
    return res.status(200).json({ 
      success: true, 
      note: 'Basic autoresponse will be sent via FormSubmit',
      error: error.message
    });
  }
}

function getThankYouEmailHTML(name, industry) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You - Kove Media</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">KOVE MEDIA</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 800;">✅ Thank You, ${name}!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We've received your request for a professional website${industry ? ` for your ${industry} business` : ''}. We're excited to help you get more leads and grow your business!
              </p>
              
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <p style="color: #991b1b; margin: 0; font-size: 16px; font-weight: 600; margin-bottom: 10px;">📋 What Happens Next?</p>
                <ul style="color: #7f1d1d; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>We'll review your request and contact you within 24 hours</li>
                  <li>We'll schedule a quick 10-minute call to discuss your needs</li>
                  <li>You'll receive a free mockup before we start building</li>
                  <li>Your website will be ready in just 3 business days</li>
                </ul>
              </div>
              
              <div style="background-color: #1f2937; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <p style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">Your Package</p>
                <p style="color: #dc2626; margin: 0; font-size: 32px; font-weight: 900;">$497</p>
                <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">one-time payment</p>
                <p style="color: #ffffff; margin: 20px 0 0 0; font-size: 14px;">Ready in <strong>3 business days</strong></p>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                If you have any questions before we connect, feel free to reply to this email or call us directly.
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                Looking forward to building your website!<br>
                <strong style="color: #1f2937;">The Kove Media Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                © ${new Date().getFullYear()} Kove Media. Built for the trades.
              </p>
              <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getThankYouEmailText(name, industry) {
  return `
Thank You, ${name}!

We've received your request for a professional website${industry ? ` for your ${industry} business` : ''}. We're excited to help you get more leads and grow your business!

WHAT HAPPENS NEXT?
- We'll review your request and contact you within 24 hours
- We'll schedule a quick 10-minute call to discuss your needs
- You'll receive a free mockup before we start building
- Your website will be ready in just 3 business days

YOUR PACKAGE
$497 one-time payment
Ready in 3 business days

If you have any questions before we connect, feel free to reply to this email.

Looking forward to building your website!
The Kove Media Team

© ${new Date().getFullYear()} Kove Media. Built for the trades.
  `;
}
