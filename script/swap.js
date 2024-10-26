const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "swap",
  version: "7.2",
  hasPermssion: 0,
  credits: "Hazeyy",
  description: "( 𝙵𝚊𝚌𝚎 𝚂𝚠𝚊𝚙 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝚂𝚠𝚊𝚙𝚙𝚒𝚗𝚐 𝙸𝚖𝚊𝚐𝚎𝚜/𝙵𝚊𝚌𝚎𝚜 )",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.toLowerCase().startsWith("swap"))) return;

  const args = event.body.split(/\s+/);
  args.shift(); 

  const reply = (message) => api.sendMessage(message, event.threadID, event.messageID);

  if (event.type === "message_reply") {
    const attachments = event.messageReply.attachments.filter(attachment => attachment.type === "photo");

    if (attachments.length >= 2) {
      const [url1, url2] = attachments.map(attachment => attachment.url);
      const path = __dirname + `/cache/swapped_image.jpg`;

      api.sendMessage("🔮 | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚠𝚑𝚒𝚕𝚎 𝚠𝚎 𝚜𝚠𝚊𝚙 𝚢𝚘𝚞𝚛 𝚒𝚖𝚊𝚐𝚎𝚜...", event.threadID, event.messageID);

      try {
        const response = await axios.get('https://haze-faceswap.replit.app/swap', {
          params: {
            swap_image: url1,
            target_image: url2
          }
        });

        const processedImageURL = response.data.hazeswap;
        const { data } = await axios.get(processedImageURL, { responseType: "stream" });

        const writer = fs.createWriteStream(path);
        data.pipe(writer);

        writer.on('finish', () => {
          api.sendMessage({
            body: "🔮 𝙸𝚖𝚊𝚐𝚎 𝚂𝚠𝚊𝚙 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢",
            attachment: fs.createReadStream(path)
          }, event.threadID, (err, messageInfo) => {
            if (err) {
              reply("🤖 𝙴𝚛𝚛𝚘𝚛 𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚖𝚎𝚜𝚜𝚊𝚐𝚎: " + err);
            } else {
              fs.unlinkSync(path);
            }
          });
        });
      } catch (error) {
        reply(`🤖 𝙿𝚛𝚘𝚌𝚎𝚜𝚜𝚎𝚜𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎𝚜: ${error}`);
      }
    } else {
      reply("🔮 𝙵𝚊𝚌𝚎 𝚂𝚠𝚊𝚙\n\n𝚄𝚜𝚊𝚐𝚎: 𝚜𝚠𝚊𝚙 [ 𝚛𝚎𝚙𝚕𝚢 1 𝚊𝚗𝚍 2 𝚒𝚖𝚊𝚐𝚎 ]");
    }
  }
};

module.exports.run = async function({api, event}) {};
