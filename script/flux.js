const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'flux',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: [],
    description: 'Generate an image based on a given prompt using the Flux API.',
    usage: 'flux <prompt> [model 1-5]\n' +
           'Example without model: flux dog\n' +
           'Example with model: flux dog 5',
    credits: 'chilli',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    if (args.length === 0) {
        return api.sendMessage(
            `Please provide a prompt to generate an image.\n\nUsage:\n` +
            `flux <prompt> [model 1-5]\n` +
            `Example without model: flux dog\n` +
            `Example with model: flux dog 5`, 
            event.threadID, 
            event.messageID
        );
    }

    let model = 4;
    const lastArg = args[args.length - 1];
    if (/^[1-5]$/.test(lastArg)) {
        model = lastArg;
        args.pop();
    }

    const prompt = args.join(' ');

    const apiUrl = `https://joshweb.click/api/flux?prompt=${encodeURIComponent(prompt)}&model=${model}`;

    api.sendMessage('Generating image... Please wait.', event.threadID, () => {}, event.messageID);

    try {
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        const fileName = `flux_${Date.now()}.png`;
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
            api.sendMessage('There was an error generating the image. Please try again later.', event.threadID, event.messageID);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });
    } catch (error) {
        console.error('Error generating image:', error);
        api.sendMessage('An error occurred while generating the image. Please try again later.', event.threadID, event.messageID);
    }
};
