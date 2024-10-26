const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "Upscale",
  version: "4.4",
  hasPermssion: 0,
  credits: "𝖢𝗂𝖼𝗂",
  description: "( 𝚄𝚙𝚜𝚌𝚊𝚕𝚎 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝚂𝚌𝚊𝚕𝚒𝚗𝚐 𝙸𝚖𝚊𝚐𝚎𝚜 )",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("upscale") === 0 || event.body.indexOf("Upscale") === 0)) return;
  const args = event.body.split(/\s+/);
  args.shift();

  const pathie = __dirname + `/cache/zombie.jpg`;
  const { threadID, messageID } = event;

  const photoUrl = event.messageReply.attachments[0] ? event.messageReply.attachments[0].url : args.join(" ");

  if (!photoUrl) {
    api.sendMessage("🤖 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚙𝚑𝚘𝚝𝚘 𝚝𝚘 𝚙𝚛𝚘𝚌𝚎𝚎𝚍 𝚞𝚙𝚜𝚌𝚊𝚕𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎𝚜.", threadID, messageID);
    return;
  }

  api.sendMessage("🕟 | 𝘜𝘱𝘴𝘤𝘢𝘭𝘪𝘯𝘨 𝘐𝘮𝘢𝘨𝘦, 𝘗𝘭𝘦𝘢𝘴𝘦 𝘸𝘢𝘪𝘵 𝘧𝘰𝘳 𝘢 𝘮𝘰𝘮𝘦𝘯𝘵..", threadID, async () => {
    try {
      const response = await axios.get(`https://hazee-upscale.replit.app/upscale?url=${encodeURIComponent(photoUrl)}&face_enhance=true`);
      const processedImageURL = response.data.hazescale;
      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      api.sendMessage({
        body: "🔮 𝘜𝘱𝘴𝘤𝘢𝘭𝘦 𝘴𝘶𝘤𝘤𝘦𝘴𝘴𝘧𝘶𝘭𝘭𝘺",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    } catch (error) {
      api.sendMessage(`🚫 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎: ${error}`, threadID, messageID);
    }
  });
};

module.exports.run = async function ({ api, event }) {};
