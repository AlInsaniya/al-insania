const https = require(‘https’);

exports.handler = async (event) => {
console.log(‘Function called, method:’, event.httpMethod);
console.log(‘Body:’, event.body);

if (event.httpMethod !== ‘POST’) {
return { statusCode: 405, body: ‘Method Not Allowed’ };
}

let message;
try {
const parsed = JSON.parse(event.body);
message = parsed.message;
} catch(e) {
console.log(‘Parse error:’, e.message);
return { statusCode: 400, body: ‘Bad Request’ };
}

const token = process.env.TG_TOKEN;
const chatId = process.env.TG_CHAT;

console.log(‘Token exists:’, !!token);
console.log(‘ChatId:’, chatId);

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
res.on(‘end’, () => {
console.log(‘TG response:’, data);
resolve({ statusCode: 200, body: data });
});
});
req.on(‘error’, (e) => {
console.log(‘Request error:’, e.message);
resolve({ statusCode: 500, body: e.message });
});
req.write(payload);
req.end();
});
};
