const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "sing",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Search music",
    hasPrefix: false,
    aliases: ["sing", "music"],
    usage: "[sing] <song name>",
    cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
    try {
        const query = args.join(" ");
        if (!query) {
            return api.sendMessage("Please provide a song name to search for on Spotify ex: sing binalewala.", event.threadID);
        }

        const apiUrl = `https://hiroshi-rest-api.replit.app/search/spotify?search=${encodeURIComponent(query)}`;
        
        api.sendMessage("Searching your music, please wait...", event.threadID);

        const response = await axios.get(apiUrl);
        const results = response.data;

        if (!results || results.length === 0) {
            return api.sendMessage("No results found for your search query.", event.threadID);
        }

        const track = results[0];
        const trackName = track.name;
        const trackUrl = track.track;

        const audioUrl = track.download;
        const audioPath = path.join(__dirname, "spotifySong.mp3");

        const audioResponse = await axios({
            url: audioUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(audioPath);
        audioResponse.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
                body: `Here is "${trackName}" from Spotify: ${trackUrl}`,
                attachment: fs.createReadStream(audioPath)
            }, event.threadID, () => {
                fs.unlinkSync(audioPath);
            });
        });

        writer.on('error', (err) => {
            console.error('Stream writer error:', err);
            api.sendMessage("An error occurred while processing the request.", event.threadID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
