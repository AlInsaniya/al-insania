const https = require(‘https’);

exports.handler = async (event) => {
if (event.httpMethod !== ‘POST’) {
return { statusCode: 405, body: ‘Method Not Allowed’ };
}

const { message } = JSON.parse(event.body);
const token = process.env.TG_TOKEN;
const chatId = process.env.TG_CHAT;

const payload = JSON.stringify({
chat_id: chatId,
text: message,
parse_mode: ‘HTML’
});

return new Promise((resolve) => {
const req = https.request({
hostname: ‘api.telegram.org’,
path: `/bot${token}/sendMessage`,
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘Content-Length’: Buffer.byteLength(payload)
}
}, (res) => {
let data = ‘’;
res.on(‘data’, chunk => data += chunk);
res.on(‘end’, () => resolve({ statusCode: 200, body: data }));
});
req.on(‘error’, (e) => resolve({ statusCode: 500, body: e.message }));
req.write(payload);
req.end();
});
};
