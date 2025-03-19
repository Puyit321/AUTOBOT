const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jay", // Changed the credits to "Jay"
    description: "EDUCATIONAL",
    usePrefix: true,
    commandCategory: "AI",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const question = args.join(' ');
    const apiUrl = `https://ccprojectsapis.zetsu.xyz/api/gpt3?ask=${encodeURIComponent(question)}`;

    if (!question) return api.sendMessage("you don't have a question!", event.threadID, event.messageID);

    try {
        

        const response = await axios.get(apiUrl);
        const answer = response.data.data;

        api.sendMessage(`•| 𝙷𝙾𝙼𝙴𝚁 𝙰𝚄𝚃𝙾𝙱𝙾𝚃 |•\n\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻 : ${question}\n\n𝗔𝗻𝘀𝘄𝗲𝗿 : ${answer}\n\n•| 𝙾𝚆𝙽𝙴𝚁 : 𝙷𝙾𝙼𝙴𝚁 𝚁𝙴𝙱𝙰𝚃𝙸𝚂 |•`, event.threadID, event.messageID); // Added the FB link
    } catch (error) {
        console.error(error);
        api.sendMessage("Unexpected error from this Homer AI Bot.", event.threadID);
    }
};