const axios = require('axios');

module.exports.config = {
  name: "joke",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "Developer",
  description: "Fetches a random joke.",
  usages: "joke",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  try {
    api.sendMessage("⌛😂 Fetching a joke for you...", threadID, messageID);
    
    const response = await axios.get('https://nash-rest-api-production.up.railway.app/joke');
    const joke = response.data.joke;

    if (joke) {
      api.sendMessage({
        body: `😂 Here's a joke for you:\n\😂${joke}`,
      }, threadID, messageID);
    } else {
      api.sendMessage("Sorry, I couldn't fetch a joke at the moment.", threadID, messageID);
    }
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, threadID, messageID);
  }
};
