const axios = require('axios');

module.exports.config = {
    name: 'ai',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['gemini', 'gm'],
    description: 'Interact with the Gemin',
    usage: 'gemini [custom prompt] (attach image or not)',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const attachment = event.messageReply?.attachments[0] || event.attachments[0];
    const customPrompt = args.join(' ');

    if (!customPrompt && !attachment) {
        return api.sendMessage('Please provide a prompt or attach a photo for the gemini to analyze.', event.threadID, event.messageID);
    }

    let apiUrl = 'https://kaiz-apis.gleeze.com/api/gemini-vision?';

    if (attachment && attachment.type === 'photo') {
        const prompt = customPrompt || 'answer this photo';
        const imageUrl = attachment.url;
        apiUrl += `q=${encodeURIComponent(prompt)}&imageUrl=${encodeURIComponent(imageUrl)}&uid=1`;
    } else {
        apiUrl += `q=${encodeURIComponent(customPrompt)}`;
    }

    const initialMessage = await new Promise((resolve, reject) => {
        api.sendMessage({
            body: '🔍 Processing your request...',
            mentions: [{ tag: event.senderID, id: event.senderID }],
        }, event.threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        }, event.messageID);
    });

    try {
        const response = await axios.get(apiUrl);
        const aiResponse = response.data.message; // Accessing the "gemini" key directly

        const formattedResponse = `
✨ 𝙶𝚎𝚖𝚒𝚗𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎
━━━━━━━━━━━━━━━━━━
${aiResponse.trim()}
━━━━━━━━━━━━━━━━━━
-Bogart Gwapo
        `;

        await api.editMessage(formattedResponse.trim(), initialMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        await api.editMessage('An error occurred, please try use "ai2" command.', initialMessage.messageID);
    }
};
