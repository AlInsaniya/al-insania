exports.handler = async (event) => {
if (event.httpMethod !== ‘POST’) {
return { statusCode: 405, body: ‘Method Not Allowed’ };
}

const { message } = JSON.parse(event.body);
const token = process.env.TG_TOKEN;
const chatId = process.env.TG_CHAT;

const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’ },
body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: ‘HTML’ })
});

const data = await response.json();

return {
statusCode: 200,
body: JSON.stringify(data)
};
};
