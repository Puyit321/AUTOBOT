const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermission: 0,
    credits: "GeoDevz", // cmd by George, not the API
    description: "GPT architecture",
    usePrefix: false,
    commandCategory: "GPT4",
    cooldowns: 20,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply } = event;
        let prompt = args.join(' ');

        // Include replied message in the prompt if it exists
        if (messageReply) {
            const repliedMessage = messageReply.body;
            prompt = `${repliedMessage} ${prompt}`;
        }

        // Check for attachment in the replied message
        let content = "";
        if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
            const attachment = event.messageReply.attachments[0];
            content = attachment.url;
        }

        // If no prompt is provided, send a help message
        if (!prompt) {
            return api.sendMessage(
                `please provide a question!\nExample : ai what is Bogart AI Bot?`,
                event.threadID,
                messageID
            );
        }

        // Delay
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay time as needed

        const roleplay = "";

        const gpt4_api = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(prompt)}&roleplay=${encodeURIComponent(roleplay)}&uid=${event.senderID}&imageUrl=${encodeURIComponent(content)}`;

        const response = await axios.get(gpt4_api);

        if (response.data && response.data.message) {
            const generatedText = response.data.message;

            // AI Answer
            api.sendMessage(
                `•| 𝙱𝙾𝙶𝙰𝚁𝚃 𝙰𝙸 𝙱𝙾𝚃 |•\n\n${generatedText}\n\n𝙱𝚘𝚝 𝚠𝚊𝚜 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚑𝚎𝚛𝚎 : https://bogart-autobot.neocities.org\n\n•| 𝙾𝚆𝙽𝙴𝚁 : 𝙷𝙾𝙼𝙴𝚁 𝚁𝙴𝙱𝙰𝚃𝙸𝚂 |•`,
                event.threadID,
                messageID
            );
        } else {
            console.error('API response did not contain expected data:', response.data);
            api.sendMessage(
                `❌ 𝙰𝙽 𝙴𝚁𝚁𝙾𝚁 𝙾𝙲𝙲𝚄𝚁𝚁𝙴𝙳 𝚆𝙷𝙄𝙻𝙴 𝙶𝙴𝙉𝙴𝚁𝙰𝚃𝙸𝙽𝙶 𝚃𝙷𝙴 𝚃𝙴𝚇𝚃 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴. 𝙿𝙻𝙴𝙰𝚂𝙴 𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽 𝙻𝙰𝚃𝙴𝚁. 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴 𝙳𝙰𝚃𝙰: ${JSON.stringify(response.data)}`,
                event.threadID,
                messageID
            );
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(
            `${error}`,
            event.threadID,
            event.messageID
        );
    }
};
