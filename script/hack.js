const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'hack',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['hackuser'],
    description: 'Fake hack command that generates a mock hack screen.',
    usage: 'hack [mention]',
    credits: 'chilli',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    let mentionedUser;

    if (Object.keys(event.mentions).length > 0) {
        mentionedUser = Object.keys(event.mentions)[0];
    } else if (event.messageReply && event.messageReply.senderID) {
        mentionedUser = event.messageReply.senderID;
    } else {
        return api.sendMessage('Please mention or reply to a user’s message to use this command.', event.threadID, event.messageID);
    }

    try {
        const userInfo = await api.getUserInfo(mentionedUser);
        const userName = userInfo[mentionedUser].name;
        const apiUrl = `https://api-canvass.vercel.app/hack?name=${encodeURIComponent(userName)}&uid=${mentionedUser}`;

        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        const fileName = `hack_${Date.now()}.png`;
        const filePath = path.join(cacheDir, fileName);
        const response = await axios({
            method: 'GET',
            url: apiUrl,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            // Send the fake hack screen in the chat
            await api.sendMessage({
                body: `🚨 Hacked ${userName}! 🚨`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, event.messageID);

            // Delete the file after sending
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        });

        writer.on('error', () => {
            api.sendMessage('There was an error creating the fake hack image. Please try again later.', event.threadID, event.messageID);
            // Ensure file cleanup even on error
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });
    } catch (error) {
        console.error('Error fetching fake hack image:', error);
        api.sendMessage('An error occurred while generating the fake hack image. Please try again later.', event.threadID, event.messageID);
    }
};
