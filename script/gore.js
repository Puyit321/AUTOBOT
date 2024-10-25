const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "gore",
    version: "1.0.0",
    role: 2,
    credits: "chill", 
    description: "Send a random gore video",
    hasPrefix: false,
    aliases: ["randgore", "gore"],
    usage: "[randomgore]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event }) {
    try {
        api.sendMessage("⏱️ | Fetching a random gore video, please wait...", event.threadID);

        const poginichill = await axios.get('https://joshweb.click/api/randgre');
        const chilli = poginichill.data.result;

        if (!chilli || chilli.length === 0) {
            api.sendMessage("No gore videos found.", event.threadID);
            return;
        }

        const mabantotTitle = chilli.title;
        const mabantotSource = chilli.source;
        const mabantotViews = chilli.view;
        const mabantotComments = chilli.comment;
        const mabantotVotes = chilli.vote;
        const mabantotUrl = chilli.video1;

        if (!mabantotUrl) {
            api.sendMessage("No valid gore video found.", event.threadID);
            return;
        }

        const message = `Title: ${mabantotTitle}\nSource: ${mabantotSource}\nViews: ${mabantotViews}\nComments: ${mabantotComments}\nVotes: ${mabantotVotes}`;

        const filePath = path.join(__dirname, `/cache/gore_video.mp4`);
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
            method: 'get',
            url: mabantotUrl,
            responseType: 'stream'
        });

        videoResponse.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage(
                { body: message, attachment: fs.createReadStream(filePath) },
                event.threadID,
                () => fs.unlinkSync(filePath)
            );
        });

        writer.on('error', () => {
            api.sendMessage("An error occurred while downloading the video.", event.threadID);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
