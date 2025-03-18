const axios = require('axios');

const services = [
  { url: 'https://kaiz-apis.gleeze.com/api/gpt-4o', param: { prompt: 'ask', uid: 'uid' }, isCustom: true }
];

async function callService(service, prompt, senderID) {
  if (service.isCustom) {
    try {
      const apiUrl = `${service.url}?ask=${encodeURIComponent(prompt)}&uid=${encodeURIComponent(senderID)}`;
      const response = await axios.get(apiUrl);
      return response.data.response || response.data;
    } catch (error) {
      console.error(`Custom service error from ${service.url}: ${error.message}`);
      throw new Error(`Error from ${service.url}: ${error.message}`);
    }
  } else {
    const params = {};
    for (const [key, value] of Object.entries(service.param)) {
      params[key] = key === 'uid' ? senderID : encodeURIComponent(prompt);
    }
    const queryString = new URLSearchParams(params).toString();
    try {
      const response = await axios.get(`${service.url}?${queryString}`);
      return response.data.response || response.data;
    } catch (error) {
      console.error(`Service error from ${service.url}: ${error.message}`);
      throw new Error(`Error from ${service.url}: ${error.message}`);
    }
  }
}

async function getFastestValidAnswer(prompt, senderID) {
  const promises = services.map(service => callService(service, prompt, senderID));
  const results = await Promise.allSettled(promises);
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      return result.value;
    }
  }
  throw new Error('All services failed to provide a valid answer');
}

const ArYAN = ['ai', 'ming'];

module.exports = {
  config: {
    name: 'ai2',
    version: '1.0.1',
    author: 'KA TIANN JHYU',
    role: 0,
    category: 'ai',
    longDescription: {
      en: 'This is a large AI language model designed to assist with a wide range of tasks.',
    },
    guide: {
      en: '\nAi < questions >\n\nâš™ï¸Guide\n Ai missyoubalikana',
    },
  },

  langs: {
    en: {
      final: "",
      header: " ðŸ¤– ð— ð—œð—¡ð—š ð—”ð—¦ð—¦ð—œð—¦ð—§ð—”ð—¡ð—§ ðŸ˜¼\nâ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”",
      footer: "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”",
    }
  },

  onStart: async function () {
    // Empty onStart function
  },

  onChat: async function ({ api, event, args, getLang }) {
    try {
      const prefix = ArYAN.find(p => event.body && event.body.toLowerCase().startsWith(p));
      let prompt;

      if (event.type === 'message_reply') {
        const replyMessage = event.messageReply;

        if (replyMessage.body && replyMessage.body.startsWith(getLang("header"))) {
          prompt = event.body.trim();
          prompt = `${replyMessage.body}\n\nUser reply: ${prompt}`;
        } else {
          return;
        }
      } else if (prefix) {
        prompt = event.body.substring(prefix.length).trim() || 'hello';
      } else {
        return;
      }

      if (prompt === 'hello') {
        const greetingMessage = `${getLang("header")}\nHello! How can I assist you today?\n${getLang("footer")}`;
        api.sendMessage(greetingMessage, event.threadID, event.messageID);
        console.log('Sent greeting message as a reply to user');
        return;
      }

      try {
        const fastestAnswer = await getFastestValidAnswer(prompt, event.senderID);

        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
        const userInfo = await api.getUserInfo(event.senderID);
        const userName = userInfo[event.senderID]?.name || 'User';

        const finalMsg = `${getLang("header")}\n${fastestAnswer}\nâ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ—£ð—”ð˜€ð—¸ð—²ð—± ð—•ð˜†: ${userName}\nâ° ð—¥ð—²ð˜€ð—½ð—¼ð—»ð—± ð—§ð—¶ð—ºð—²: ${responseTime}\n${getLang("footer")}`;
        api.sendMessage(finalMsg, event.threadID, event.messageID);

        console.log('âœ… Sent answer as a reply to user');
      } catch (error) {
        console.error(`âŒ Failed to get answer: ${error.message}`);
        api.sendMessage(`${error.message}.`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(`Failed to process chat: ${error.message}`);
      api.sendMessage(`${error.message}.`, event.threadID, event.messageID);
    }
  }
};