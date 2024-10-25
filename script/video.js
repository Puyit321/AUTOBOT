const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "video",
  version: "9",
  credits: "Cliff",
  description: "Search video from YouTube",
  commandCategory: "media",
  hasPermssion: 0,
  cooldowns: 9,
  usages: "[video [search]",
  role: 0,
  hasPrefix: false,
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      const messageInfo = await new Promise(resolve => {
            api.sendMessage('Usage: video <search text>', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
    }

 const ugh = await new Promise(resolve => { api.sendMessage(`⏱️ | Searching, for '${searchQuery}' please wait...`, event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

    const response = await axios.get(`https://betadash-search-download.vercel.app/video?search=${encodeURIComponent(searchQuery)}`);

    const data = response.data;
    const videoUrl = data.downloadUrl;
    const title = data.title;
    const thumbnail = data.thumbnail;

    const videoPath = path.join(__dirname, "cache", "videov2.mp4");

    const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });

    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

api.unsendMessage(ugh.messageID);

    await api.sendMessage(
      {
        body: `Here's your video, enjoy!🥰\n\n𝗧𝗶𝘁𝘁𝗹𝗲: ${title}`,
        attachment: fs.createReadStream(videoPath),
      },
      event.threadID,
      event.messageID
    );
    fs.unlinkSync(videoPath);
  } catch (error) {
             const tf = await new Promise(resolve => {
                api.sendMessage(error.message, event.threadID, (err, info) => {
                    resolve(info);
                });
            });

            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);

            return;
  }
};
