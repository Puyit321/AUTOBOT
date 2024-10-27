const axios = require('axios');
module.exports.config = {
  name: "quote",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Get a random inspirational quote.",
  usage: "quote",
  credits: "ArYAN",
  cooldown: 0
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  try {
    const response = await axios.get('https://c-v5.onrender.com/api/quote');
    const { quote } = response.data;
    api.sendMessage(`${quote}`, threadID, messageID);
  } catch (error) {
    api.sendMessage("Sorry, I couldn't fetch a quote at the moment. Please try again later.", threadID, messageID);
  }
};
