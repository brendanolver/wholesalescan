const AM_SUBDOMAIN = 'kohindustries';
const AM_TOKEN     = '1e10c8f6d6bfbbddc025e880f8b08197';
const AM_BASE      = `https://${AM_SUBDOMAIN}.app.apparelmagic.com/api`;

exports.handler = async (event) => {
  const path = event.queryStringParameters?.path;

  if (!path) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing path parameter' }) };
  }

  // Whitelist only the endpoints the app uses
  if (!/^(orders\/[\w-]+|inventory\/[\w-]+)$/.test(path)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden path' }) };
  }

  const url = `${AM_BASE}/${path}?token=${AM_TOKEN}`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    const body = await res.text();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    };
  } catch (e) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
