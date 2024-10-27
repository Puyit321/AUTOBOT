const axios = require('axios');
const fs = require('fs');
const path = require('path');
const request = require('request');

const baseURL = 'https://c-v5.onrender.com';
const endpoints = {
  getShotiVideo: '/api/shoti',
  usage: '/api/usage'
};

module.exports.config = {
  name: "shotiv3",
  version: "1.1.0",
  role: 0,
  hasPrefix: true,
  usage: 'shoti',
  description: 'Get a random Shoti video.',
  credits: 'ArYAN',
  cooldown: 5
};

module.exports.run = async function({ message, api, event }) {
  const { threadID, messageID } = event;

  api.sendMessage("Fetching Shoti video...", threadID, messageID);

  const startTime = Date.now();
  const videoPath = path.join(__dirname, "cache/shoti.mp4");

  try {
    const response = await axios.get(`${baseURL}${endpoints.getShotiVideo}`);
    const { title, shotiurl: videoURL, username, nickname, duration, region } = response.data;

    const usageResponse = await axios.get(`${baseURL}${endpoints.usage}`);
    const totalRequests = usageResponse.data.totalRequests;

    const file = fs.createWriteStream(videoPath);
    const downloadRequest = request(videoURL);

    downloadRequest.pipe(file);

    downloadRequest.on('finish', () => {
      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      const messageToSend = {
        body: `🎀 𝗦𝗵𝗼𝘁𝗶\n━━━━━━━━━━\n📝 𝗧𝗶𝘁𝗹𝗲: ${title || "No title"}\n👤 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${username}\n🎯 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${nickname}\n⏳ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration} seconds\n🌍 𝗥𝗲𝗴𝗶𝗼𝗻: ${region}\n\n📦 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝘀: ${totalRequests}\n⏰ 𝗧𝗮𝗸𝗲𝗻 𝗧𝗶𝗺𝗲: ${timeTaken} seconds`,
        attachment: fs.createReadStream(videoPath)
      };

      api.sendMessage(messageToSend, threadID, (err) => {
        if (err) {
          console.error("Error sending video:", err);
          api.sendMessage("An error occurred while sending the video.", threadID, messageID);
        }

        fs.unlink(videoPath, (err) => {
          if (err) console.error("Error deleting video file:", err);
        });
      });
    });

    downloadRequest.on('error', (err) => {
      console.error("Error downloading video:", err);
      api.sendMessage("An error occurred while downloading the video.", threadID, messageID);
    });

  } catch (error) {
    console.error("Error fetching Shoti video:", error);
    api.sendMessage("Sorry, I couldn't fetch the Shoti video at the moment. Please try again later.", threadID, messageID);
  }
};
