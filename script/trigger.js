const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'trigger',
    version: '1.0.1',
    role: 0,
    hasPrefix: true,
    aliases: [],
    description: 'Generate a triggered GIF for a mentioned user, replied user, or yourself',
    usage: 'trigger [@mention or reply]',
    credits: 'chill',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    let userId;

    if (event.messageReply) {
        // If replying to a message, trigger the user who sent that message
        userId = event.messageReply.senderID;
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        // If a user is mentioned, trigger the mentioned user
        userId = Object.keys(event.mentions)[0];
    } else {
        // Default to triggering the command sender
        userId = event.senderID;
    }

    const apiUrl = `https://joshweb.click/canvas/trigger?uid=${userId}`;

    try {
        const response = await axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'arraybuffer' // Since it's an image (GIF), we use arraybuffer
        });

        const buffer = Buffer.from(response.data, 'binary');
        const filePath = path.resolve(__dirname, 'triggered.gif');
        fs.writeFileSync(filePath, buffer);

        await api.sendMessage(
            {
                body: `Triggered!`,
                mentions: [{ tag: userId, id: userId }],
                attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            () => {
                fs.unlinkSync(filePath); // Clean up the file after sending
            },
            event.messageID
        );

    } catch (error) {
        console.error('Error creating triggered GIF:', error);
        api.sendMessage('Failed to generate triggered GIF. Please try again later.', event.threadID, event.messageID);
    }
};
