module.exports.config = {
  name: `ai`,
  version: "1.1.0",
  permission: 0,
  credits: "Metoushela",
  description: "",
  prefix: false,
  premium: false,
  category: "without prefix",
  usage: ``,
  cooldowns: 3,
  dependency: {
    "axios": ""
  }
};

module.exports.run = async function ({api, event, args}) {
  try{
  const axios = require('axios');
  let ask = args.join(' ');
  if (!ask) {
    return api.sendMessage('please provide a question.', event.threadID, event.messageID)
  }

  const res = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?q=${ask}&uid=${event.senderID}`);
  const reply = res.data.response;
  if (res.error) {
    return api.sendMessage('having some unexpected error while fetching api.', event.threadID, event.messageID)
  } else {
    return api.sendMessage(`•| 𝙷𝙾𝙼𝙴𝚁 𝙰𝚄𝚃𝙾𝙱𝙾𝚃 |•\n\n${reply}\n\n•| 𝙾𝚆𝙽𝙴𝚁 : 𝙷𝙾𝙼𝙴𝚁 𝚁𝙴𝙱𝙰𝚃𝙸𝚂 |•`, event.threadID, event.messageID)
  }
  } catch (error) {
    return api.sendMessage('having some unexpected error', event.threadID, event.messageID)
  }
                           }