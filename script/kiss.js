const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'kiss',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: [],
    description: 'Generate a kiss image between two users.',
    usage: 'kiss [mention]',
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
        const apiUrl = `https://api-canvass.vercel.app/kiss2?one=${event.senderID}&two=${mentionedUser}`;

        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        const fileName = `kiss_${Date.now()}.png`;
        const filePath = path.join(cacheDir, fileName);
        const response = await axios({
            method: 'GET',
            url: apiUrl,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            await api.sendMessage({
                attachment: fs.createReadStream(filePath)
            }, event.threadID, event.messageID);

            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });

        writer.on('error', () => {
            api.sendMessage('There was an error creating the kiss image. Please try again later.', event.threadID, event.messageID);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });
    } catch (error) {
        console.error('Error fetching kiss image:', error);
        api.sendMessage('An error occurred while generating the image. Please try again later.', event.threadID, event.messageID);
    }
};
