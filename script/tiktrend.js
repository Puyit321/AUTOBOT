const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "tiktrend",
  version: "1.1",
  credits: "Churchill",
  description: "Fetch and send trending TikTok videos",
  commandCategory: "media",
  hasPermssion: 0,
  cooldowns: 10,
  usages: "tiktrend",
  role: 0,
  hasPrefix: false,
};

module.exports.run = async function ({ api, event }) {
  try {
    // Notify the user that the bot is fetching the TikTok video
    const waitingMessage = await api.sendMessage(`⏱️ | Fetching a trending TikTok video...`, event.threadID);

    // Fetch trending TikTok videos from the API
    const response = await axios.get("https://ccexplorerapisjonell.vercel.app/api/tiktrend");
    const videos = response.data.data;

    if (!videos || videos.length === 0) {
      api.sendMessage("No trending videos found.", event.threadID, event.messageID);
      return;
    }

    // Select a random video from the list
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const videoUrl = randomVideo.play;
    const title = randomVideo.title;
    const duration = randomVideo.duration;
    const cover = randomVideo.cover;
    const authorName = randomVideo.author.nickname;
    const authorAvatar = randomVideo.author.avatar;

    // Prepare the video file path for downloading
    const videoPath = path.join(__dirname, "cache", `${randomVideo.video_id}.mp4`);
    
    // Download the video
    const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

    // Prepare the message content
    const messageBody = `🎥 **Trending TikTok Video**\n\n`
                      + `**Title**: ${title}\n`
                      + `**Duration**: ${duration} seconds\n`
                      + `**Author**: ${authorName}\n`
                      + `**Views**: ${randomVideo.play_count}\n`
                      + `**Likes**: ${randomVideo.digg_count}\n`
                      + `**Shares**: ${randomVideo.share_count}\n\n`
                      + `**Thumbnail**: ${cover}`;

    // Send the video as an attachment along with the details
    await api.sendMessage(
      {
        body: messageBody,
        attachment: fs.createReadStream(videoPath),
      },
      event.threadID,
      event.messageID
    );

    // Clean up the video file after sending
    fs.unlinkSync(videoPath);

    // Remove the waiting message
    api.unsendMessage(waitingMessage.messageID);
  } catch (error) {
    api.sendMessage("An error occurred while fetching the TikTok video.", event.threadID, event.messageID);
    console.error(error);
  }
};
