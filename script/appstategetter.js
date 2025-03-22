const axios = require('axios');

module.exports.config = {
  name: 'appstategetter',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['appstate'],
  description: "AppState Getter ",
  usage: "appstate [email] [password]",
  credits: 'Kyle敦. ဗီူ',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const pangit = args[0];
  const bobo = args[1];
  const kylepogi = { className: '', textContent: '' };

  if (!pangit || !bobo) {
    kylepogi.className = 'error';
    kylepogi.textContent = 'Usage: appstate [email] [password]';
    api.sendMessage(kylepogi.textContent, event.threadID, event.messageID);
    return;
  }

  kylepogi.textContent = 'Getting AppState...';
  api.sendMessage(kylepogi.textContent, event.threadID, event.messageID);

  const appStateUrl = `https://nash-rest-api.replit.app/app-state?email=${encodeURIComponent(pangit)}&password=${encodeURIComponent(bobo)}`;

  try {
    const response = await axios.get(appStateUrl);
    const data = response.data;

    kylepogi.className = 'success';
    kylepogi.textContent = `𝗛𝗘𝗥𝗘'𝗦 𝗬𝗢𝗨𝗥 𝗔𝗣𝗣𝗦𝗧𝗔𝗧𝗘:\n▬▬▬▬▬▬▬▬▬▬▬▬\n${JSON.stringify(data, null, 2)}\n▬▬▬▬▬▬▬▬▬▬▬▬\n`;
    api.sendMessage(kylepogi.textContent, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error fetching the AppState:', error);
    kylepogi.className = 'error';
    kylepogi.textContent = 'An error occurred while fetching the AppState.';
    api.sendMessage(kylepogi.textContent, event.threadID, event.messageID);
  }
};
