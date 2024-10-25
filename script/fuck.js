const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'fuck',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['fck'],
    description: 'Generate a fuck image between two users.',
    usage: 'fuck [mention]',
    credits: 'chilli',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    const ownerUID = '100087212564100';
    let mentionedUser;

    if (Object.keys(event.mentions).length > 0) {
        mentionedUser = Object.keys(event.mentions)[0];
    } else if (event.messageReply && event.messageReply.senderID) {
        mentionedUser = event.messageReply.senderID;
    } else {
        return api.sendMessage('Please mention or reply to a user’s message to use this command.', event.threadID, event.messageID);
    }

    if (mentionedUser === ownerUID) {
        return api.sendMessage(`Fuck urself obo ka!`, event.threadID, event.messageID);
    }

    try {
        const senderName = (await api.getUserInfo(event.senderID))[event.senderID].name;
        const mentionedName = (await api.getUserInfo(mentionedUser))[mentionedUser].name;

        const apiUrl = `https://api-canvass.vercel.app/fuck?one=${event.senderID}&two=${mentionedUser}`;

        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        const fileName = `fuck_${Date.now()}.png`;
        const filePath = path.join(cacheDir, fileName);
        const response = await axios({
            method: 'GET',
            url: apiUrl,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            // Send the image in the chat
            await api.sendMessage({
                body: `💥 ${senderName} fucked ${mentionedName}!`,
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
            api.sendMessage('There was an error creating the fuck image. Please try again later.', event.threadID, event.messageID);
            // Ensure file cleanup even on error
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });
    } catch (error) {
        console.error('Error fetching fuck image or names:', error);
        api.sendMessage('An error occurred while generating the image or fetching the names. Please try again later.', event.threadID, event.messageID);
    }
};
