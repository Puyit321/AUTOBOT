module.exports.config = {
    name: "pinterestv2",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Send Pinterest pictures",
    hasPrefix: false,
    aliases: ["pin"],
    usage: "[pin image - count]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const input = args.join(" ");
        const [query, countStr] = input.split(" - ");
        let count = parseInt(countStr, 10);

        if (!query || isNaN(count)) {
            return api.sendMessage("Please provide a valid query usage: pin image - count (limit 9 count)", event.threadID);
        }

        count = Math.min(count, 9);

        const apiUrl = `https://joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`;
        api.sendMessage(`Sending ${count} Pinterest pictures for "${query}", please wait...`, event.threadID);

        const response = await axios.get(apiUrl);
        const images = response.data.result.slice(0, count);

        if (images.length === 0) {
            return api.sendMessage("No images found for the specified query.", event.threadID);
        }

        const attachments = [];

        for (let i = 0; i < images.length; i++) {
            const imageUrl = images[i];
            const imagePath = path.join(__dirname, 'cache', `image${i}.jpg`);
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, imageResponse.data);
            attachments.push(fs.createReadStream(imagePath));
        }

        api.sendMessage({
            body: `Here are your ${count} Pinterest pictures:`,
            attachment: attachments
        }, event.threadID, () => {
            attachments.forEach(stream => stream.close());
            attachments.forEach(stream => fs.unlinkSync(stream.path));
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
