import crypto from 'crypto';

const FACEBOOK_DATASET_ID = '4530724333821963';

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

if (!FACEBOOK_ACCESS_TOKEN) {
  console.error('FACEBOOK_ACCESS_TOKEN environment variable is not set');
}

const FACEBOOK_API_VERSION = 'v24.0';

function hashData(data) {
  if (!data) return null;
  return crypto
    .createHash('sha256')
    .update(data.trim().toLowerCase())
    .digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!FACEBOOK_ACCESS_TOKEN) {
    return res.status(500).json({ 
      error: 'FACEBOOK_ACCESS_TOKEN is not configured. Please set it in environment variables.' 
    });
  }

  try {
    const { data } = req.body;
    const invitee = data.invitee;

    const userData = {
      em: hashData(invitee.email),
    };

    if (invitee.phone_number) {
      userData.ph = hashData(invitee.phone_number);
    }

    const payload = {
      data: [
        {
          action_source: 'system_generated',
          event_name: 'Lead',
          event_time: Math.floor(
            new Date(invitee.created_at).getTime() / 1000
          ),
          user_data: userData,
          custom_data: {
            event_source: 'crm',
            lead_event_source: 'Calendly',
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${FACEBOOK_DATASET_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FACEBOOK_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Meta API Error:', responseData);
      return res.status(400).json({ error: responseData });
    }

    console.log('Event sent to Meta:', responseData);
    return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}


