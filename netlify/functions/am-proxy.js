const AM_SUBDOMAIN = 'kohindustries';
const AM_TOKEN     = 'cff4a1e4a3d0b3726a4117e4f14a618a';
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

  const time = Math.floor(Date.now() / 1000);
  const url = `${AM_BASE}/${path}/?token=${AM_TOKEN}&time=${time}`;

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
