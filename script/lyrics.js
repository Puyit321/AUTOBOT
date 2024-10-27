const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "lyrics",
  version: "1.1.0",
  role: 0,
  hasPrefix: true,
  usage: 'lyrics [song name]',
  description: 'Get song lyrics using the provided API.',
  credits: 'ArYAN',
  cooldown: 5
};

module.exports.run = async function({ api, event, args, message }) {
  const baseURL = 'https://c-v5.onrender.com';
  const endpoints = {
    lyrics: '/api/lyrics',
    usage: '/api/usage'
  };
  const cacheDir = path.join(__dirname, 'cache');

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  try {
    const songName = args.join(' ');
    if (!songName) {
      api.sendMessage("Please provide a song name!", event.threadID, event.messageID);
      return;
    }

    api.setMessageReaction("⏰", event.messageID, () => {}, true);
    const startTime = new Date().getTime();

    const lyricsResponse = await axios.get(`${baseURL}${endpoints.lyrics}?songName=${encodeURIComponent(songName)}`);
    const { lyrics, title, artist, image } = lyricsResponse.data;

    if (!lyrics) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("Sorry, lyrics not found. Please provide another song name!", event.threadID, event.messageID);
      return;
    }

    const usageResponse = await axios.get(`${baseURL}${endpoints.usage}`);
    const totalRequests = usageResponse.data.totalRequests;

    const endTime = new Date().getTime();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    let messageContent = `🎶 𝗟𝗬𝗥𝗜𝗖𝗦\n\n📝| 𝗧𝗶𝘁𝗹𝗲: ${title}\n👑| 𝗔𝗿𝘁𝗶𝘀𝘁: ${artist}\n📦| 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝘀: ${totalRequests}\n⏰| 𝗧𝗮𝗸𝗲𝗻 𝗧𝗶𝗺𝗲: ${timeTaken} sec\n\n🔎| 𝗟𝘆𝗿𝗶𝗰𝘀\n━━━━━━━━━━━━━━━\n${lyrics}`;

    let attachment = null;
    if (image) {
      const imagePath = path.join(cacheDir, `${title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`);

      const response = await axios({
        method: 'get',
        url: image,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      attachment = fs.createReadStream(imagePath);
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    message.reply({
      body: messageContent,
      attachment
    });

  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
