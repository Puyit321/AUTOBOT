module.exports.config = {
  name: 'userid',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  aliases: ["id"],
  description: 'finder uid',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: '',
  usage: '',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');

  const fblink = args.join(' ');

  try {
    if (!fblink) {
      return api.sendMessage('Provide fblink first!', event.threadID, event.messageID);
    }

    const response = await axios.get(`https://hastebinupload-ghost-2de6112e.vercel.app/uid?fblink=${fblink}`);
    
    api.shareContact(response.data.uid, response.data.uid, event.threadID);
  } catch (err) {
    console.error(err);
    return api.sendMessage('Api limit please try again in 15 seconds', event.threadID, event.messageID);
  }
};
