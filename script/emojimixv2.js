const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "emojimixv2",
    version: "1.0.0",
    role: 0,
    credits: "chilli", 
    description: "mixmix",
    hasPrefix: false,
    aliases: ["emojimix"],
    usage: "[emojimix]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        // Check if the correct number of arguments is provided
        if (args.length < 2) {
            api.sendMessage("ex: emojimix 🤡 🤥.", event.threadID);
            return;
        }

        const emojiOne = encodeURIComponent(args[0]);
        const emojiTwo = encodeURIComponent(args[1]);

        // Inform the user that the fetching process has started
        api.sendMessage("Fetching the mixed emoji image, please wait...", event.threadID);

        // Fetch the mixed emoji data from the API
        const response = await axios.get(`https://nash-api-end.onrender.com/emojimix?one=${emojiOne}&two=${emojiTwo}`);
        const mixedEmojiData = response.data.results[0];

        // Check if the response contains valid data
        if (!mixedEmojiData) {
            api.sendMessage("No mixed emoji image found.", event.threadID);
            return;
        }

        const imageUrl = mixedEmojiData.media_formats.png_transparent.url;

        // Define the path where the image will be temporarily stored
        const filePath = path.join(__dirname, '/cache/mixed_emoji.png');
        const writer = fs.createWriteStream(filePath);

        // Download the image and save it to the defined path
        const imageResponse = await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'stream'
        });

        // Pipe the image stream to the file
        imageResponse.data.pipe(writer);

        writer.on('finish', () => {
            // Send the image file
            api.sendMessage(
                { body: `Here is your mixed emoji: ${args[0]} + ${args[1]}`, attachment: fs.createReadStream(filePath) },
                event.threadID,
                () => fs.unlinkSync(filePath) // Delete the file after sending
            );
        });

        writer.on('error', () => {
            api.sendMessage("An error occurred while downloading the image.", event.threadID);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
