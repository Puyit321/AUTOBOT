const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseURL = 'https://c-v5.onrender.com';
const endpoints = {
  generateImage: '/v1/niji',
  usage: '/api/usage'
};

module.exports.config = {
  name: "niji",
  version: "1.1.0",
  role: 0,
  hasPrefix: true,
  usage: 'xl3 [prompt]',
  description: Generate an image using the NIJI model based on the provided prompt.',
  credits: 'ArYAN',
  cooldown: 5
};

module.exports.run = async function({ message, args, api, event }) {
  if (args.length < 1) {
    return message.reply("Invalid prompt. Please provide a prompt for image generation.");
  }

  api.setMessageReaction("⏰", event.messageID, () => {}, true);

  const startTime = Date.now();
  const tempDir = path.join(__dirname, 'cache');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFilePath = path.join(tempDir, 'xl3_generated.png');
  const replyMessage = await message.reply("Generating your image...");

  try {
    const imageResponse = await axios.get(`${baseURL}${endpoints.generateImage}?prompt=${encodeURIComponent(args.join(" "))}`, {
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(tempFilePath, imageResponse.data);

    const usageResponse = await axios.get(`${baseURL}${endpoints.usage}`);
    const totalRequests = usageResponse.data.totalRequests;

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    message.reply({
      body: `📦| 𝗠𝗼𝗱𝗲𝗹: NIJI\n🔮| 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗾: ${totalRequests}\n⏰| 𝗧𝗮𝗸𝗲𝗻 𝗧𝗶𝗺𝗲: ${timeTaken} sec.`,
      attachment: fs.createReadStream(tempFilePath)
    });

    fs.unlinkSync(tempFilePath);

  } catch (error) {
    console.error("Error during image generation:", error);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    message.reply("Request failed. Unable to generate the image at this time.");
  }
};
