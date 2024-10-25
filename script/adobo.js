const axios = require('axios');

module.exports.config = {
  name: 'adobo',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['adobo'],
  description: "Adobo AI",
  usage: "adobo [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(" ");

  if (!query) {
    api.sendMessage('Please provide a query. Example: adobo what is n1gga?', event.threadID, event.messageID);
    return;
  }

  const chillMessageInfo = await new Promise(resolve => {
    api.sendMessage('👄 𝐀𝐃𝐎𝐁𝐎 𝐀𝐈 // answering...', event.threadID, (err, info) => {
      resolve(info);
    });
  });

  const apiUrl = `https://markdevs-last-api-as2j.onrender.com/api/adobo/gpt?query=${encodeURIComponent(query)}`;
  const startTime = Date.now();

  try {
    const response = await axios.get(apiUrl);
    const adoboResponse = response.data.result;
    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const formattedResponseTime = `${responseTime}s`;

    api.getUserInfo(event.senderID, async (err, userInfo) => {
      if (err) {
        console.error('Error fetching user info:', err);
        await api.editMessage('Error fetching user info.', chillMessageInfo.messageID);
        return;
      }

      const userName = userInfo[event.senderID].name;
      const formattedResponse = `👄 𝐀𝐃𝐎𝐁𝐎 𝐀𝐈 // ${formattedResponseTime}\n━━━━━━━━━━━━━━━━━━\n${adoboResponse}\n━━━━━━━━━━━━━━━━━━\n👤 𝙰𝚜𝚔𝚎𝚍 𝚋𝚢: ${userName}`;

      try {
        await api.editMessage(formattedResponse, chillMessageInfo.messageID);
      } catch (error) {
        console.error('Error editing message:', error);
        api.sendMessage('Error editing message: ' + error.message, event.threadID, event.messageID);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    await api.editMessage('Error: ' + error.message, chillMessageInfo.messageID);
  }
};
