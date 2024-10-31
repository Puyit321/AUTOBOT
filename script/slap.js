const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'slap',
    version: '1.0.1',
    role: 0,
    hasPrefix: false,
    aliases: ['slap'],
    description: 'Slap someone with a custom image.',
    usage: 'slap @mention or slap reply',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    let targetID;
    if (event.type === 'message_reply') {
        // If the command is used in reply to a message, use the sender ID of the replied message
        targetID = event.messageReply.senderID;
    } else {
        // Otherwise, use the mentioned user
        if (event.mentions && Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0];
        } else {
            return api.sendMessage('Please mention someone to slap, or use the command in reply to a message.', event.threadID, event.messageID);
        }
    }

    const userID = event.senderID;

    // Get names of the sender and the target
    const senderName = (await api.getUserInfo(userID))[userID].name;
    const targetName = (await api.getUserInfo(targetID))[targetID].name;

    const imageUrl = `https://deku-rest-api.gleeze.com/canvas/slap?uid=${userID}&uid2=${targetID}`;
    const filePath = path.resolve(__dirname, 'slap.png');

    try {
        const response = await axios({
            url: imageUrl,
            responseType: 'stream',
        });

        response.data.pipe(fs.createWriteStream(filePath));

        response.data.on('end', async () => {
            await api.sendMessage({
                body: `${senderName} slapped ${targetName}! 👋`,
                attachment: fs.createReadStream(filePath),
            }, event.threadID, () => {
                // Delete the image file after sending
                fs.unlinkSync(filePath);
            }, event.messageID);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('An error occurred while generating the slap image. Please try again later.', event.threadID, event.messageID);
    }
};
