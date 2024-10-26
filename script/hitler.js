const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'hitler',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['hit'],
  description: "Send a canvas-generated image from the API",
  usage: "hit [mention/reply]",
  credits: 'chill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const mention = Object.keys(event.mentions)[0]; // Check if someone is mentioned
  const replyMessage = event.messageReply; 

  // If no mention or reply, send a prompt to mention or reply
  if (!mention && !replyMessage) {
    return api.sendMessage('Please reply to a message or mention someone.', event.threadID, event.messageID);
  }

  const uid = mention || replyMessage.senderID || event.senderID; // Use mentioned user ID, reply sender ID, or sender ID

  const apiUrl = `https://deku-rest-apis.ooguy.com/canvas/hitler?uid=${uid}`;
  
  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const imagePath = path.resolve(__dirname, 'hitler_image.jpg'); 
    fs.writeFileSync(imagePath, imageBuffer);

    
    api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID, () => {
      fs.unlinkSync(imagePath); // Delete the image after sending
    }, event.messageID);

  } catch (error) {
    console.error('Error fetching image:', error);
    api.sendMessage('Error fetching image. Please try again later.', event.threadID, event.messageID);
  }
};
