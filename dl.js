const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "auto-dl",
  version: "2.0.0",
  role: 0,
  hasPrefix: false,
  credits: "Kaizenji",
  description: "Auto video downloader for Instagram, Facebook, TikTok",
  usages: "Automatically detects links and download it.",
  cooldown: 0,
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  const url = this.checkLink(body);
  if (url) {
    api.setMessageReaction("📥", event.messageID, () => {}, true);
    const time = Date.now();
    const filePath = path.join(__dirname, `/cache/${time}.mp4`);
    if (url.match(/instagram\.com|facebook\.com|fb\.watch/)) {
      await this.downloadFBIG(url, api, event, filePath);
    } else if (url.match(/tiktok\.com/)) {
      await this.downloadTikTok(url, api, event, filePath);
    }
  }
};

module.exports.downloadFBIG = async function(url, api, event, filePath) {
  try {
    const res = await axios.get(`https://kaiz-media-dl-api.vercel.app/fbig?url=${encodeURIComponent(url)}`);
    const videoUrl = res.data.url;
    if (videoUrl) {
      const response = await axios({ method: "GET", url: videoUrl, responseType: "stream" });
      response.data.pipe(fs.createWriteStream(filePath));
      response.data.on('end', async () => {
        const messageBody = `𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾!`;
        api.sendMessage({ body: messageBody, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      });
    }
  } catch (err) {
    api.sendMessage("𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗋𝗈𝗆 𝖨𝗇𝗌𝗍𝖺𝗀𝗋𝖺𝗆/𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄.", event.threadID, (err, info) => {
    setTimeout(() => api.unsendMessage(info.messageID), 3000);
    }, event.messageID);
  }
};

module.exports.downloadTikTok = async function(url, api, event, filePath) {
  try {
    const res = await axios.get(`https://kaiz-media-dl-api.vercel.app/tiktok?url=${encodeURIComponent(url)}`);
    const videoUrl = res.data.url;
    if (videoUrl) {
      const response = await axios({ method: "GET", url: videoUrl, responseType: "stream" });
      response.data.pipe(fs.createWriteStream(filePath));
      response.data.on('end', async () => {
        const messageBody = `𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾!`;
        api.sendMessage({ body: messageBody, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      });
    }
  } catch (err) {
    api.sendMessage("𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗋𝗈𝗆 𝖳𝗂𝗄𝖳𝗈𝗄.", event.threadID, (err, info) => {
    setTimeout(() => api.unsendMessage(info.messageID), 3000);
    }, event.messageID);
  }
};

module.exports.checkLink = function(url) {
  const instagramFacebookRegex = /https?:\/\/(www\.)?(instagram\.com|facebook\.com|fb\.watch)\/[^\s/?#]+\/?/;
  const tiktokRegex = /https?:\/\/(www\.)?tiktok\.com\/[^\s/?#]+\/?|https?:\/\/vt\.tiktok\.com\/[^\s/?#]+\/?/;
  if (instagramFacebookRegex.test(url)) {
    return url;
  } else if (tiktokRegex.test(url)) {
    return url;
  }
  return null;
};
