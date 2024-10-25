const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'pet',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['pat'],
    description: 'Generate a pet GIF for a mentioned user, or show a special message for the owner',
    usage: 'pet [mention]',
    credits: 'chilli',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    const ownerUID = '100072704678200';
    let mentionedUser;

    if (Object.keys(event.mentions).length > 0) {
        mentionedUser = Object.keys(event.mentions)[0];
    } else if (event.messageReply && event.messageReply.senderID) {
        mentionedUser = event.messageReply.senderID;
    } else {
        return api.sendMessage('Please mention or reply to a user’s message to use this command.', event.threadID, event.messageID);
    }

    if (mentionedUser === ownerUID) {
        return api.sendMessage(`You can't pet my sensei! 😎`, event.threadID, event.messageID);
    }

    const apiUrl = `https://api-canvass.vercel.app/pet?userid=${mentionedUser}`;

    try {
        const response = await axios({
            method: 'GET',
            url: apiUrl,
            responseType: 'stream',
        });

        const fileName = `pet_${mentionedUser}.gif`;
        const filePath = path.join(__dirname, fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', async () => {
            await api.sendMessage({
                attachment: fs.createReadStream(filePath)
            }, event.threadID, event.messageID);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        });

        writer.on('error', () => {
            api.sendMessage('There was an error creating the pet GIF. Please try again later.', event.threadID, event.messageID);
        });
    } catch (error) {
        console.error('Error fetching pet GIF:', error);
        api.sendMessage('An error occurred while generating the GIF. Please try again later.', event.threadID, event.messageID);
    }
};
