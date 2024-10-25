const axios = require('axios');

module.exports.config = {
  name: "claude",
  role: 0,
  credits: "chill",
  description: "claude ml",
  hasPrefix: false,
  version: "1.0.0",
  aliases: ["claude"],
  usage: "claude [question]"
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(" ");

  if (!question) {
    return api.sendMessage('Please provide a question.', event.threadID, event.messageID);
  }

  const initialMessage = await new Promise((resolve, reject) => {
    api.sendMessage('Asking Claude your question, please wait...', event.threadID, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });

  try {
    const response = await axios.get(`https://hiroshi-rest-api.replit.app/ai/claude?ask=${encodeURIComponent(question)}`);
    const answer = response.data.response;

    const formattedResponse = `
🧠 𝐶𝐿𝐴𝑈𝐷𝐸 𝐴𝐼
━━━━━━━━━━━━━━━━━━
${answer}
━━━━━━━━━━━━━━━━━━
    `;

    await api.editMessage(formattedResponse, initialMessage.messageID);
  } catch (error) {
    console.error(error);
    await api.editMessage('❌ | An error occurred while processing your request.', initialMessage.messageID);
  }
};
