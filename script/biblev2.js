const axios = require('axios');
module.exports.config = {
  name: "biblev2",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Get a random bibles.",
  usage: "bible",
  credits: "ArYAN",
  cooldown: 0
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  try {
    const response = await axios.get('https://c-v5.onrender.com/api/bible');
    const { verse } = response.data;
    api.sendMessage(`${verse}`, threadID, messageID);
  } catch (error) {
    api.sendMessage("Sorry, I couldn't fetch a bible at the moment. Please try again later.", threadID, messageID);
  }
};
