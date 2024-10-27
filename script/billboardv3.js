const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "billboardv3",
  version: "1.0.0",
  role: 0,
  credits: "convert by kramywhite",
  description: "Generate a billboard image",
  hasPrefix: false,
  aliases: ["billboard"],
  usage: "[billboard <text>]",
  countdown: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const text = args.join(" ");

    if (!text) {
      api.sendMessage("❌ Please provide the text. Usage: billboard <text>", event.threadID);
      return;
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://api-canvass.vercel.app/billboard?text=${encodedText}`;
    const imagePath = __dirname + '/billboard.png';

    api.sendMessage("Generating your billboard, please wait...", event.threadID);

    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    writer.on('finish', async () => {
      try {
        await api.sendMessage({
          attachment: fs.createReadStream(imagePath)
        }, event.threadID);

        fs.unlinkSync(imagePath);
      } catch (sendError) {
        console.error('Error sending image:', sendError);
        api.sendMessage("An error occurred while sending the image.", event.threadID);
      }
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
