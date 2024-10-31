const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "slap",
    description: "Slap another user!",
    usage: "@mention or reply to a message",
    cooldown: 5,
    accessableby: 0,
    category: "fun",
    prefix: true
  },
  start: async function({ event, api, args, Users, reply }) {
    let mentionedID;

    // Check if the message is a reply
    if (event.messageReply) {
      mentionedID = event.messageReply.senderID;
    } 
    // Check if the message mentions someone
    else if (event.mentions && Object.keys(event.mentions).length > 0) {
      mentionedID = Object.keys(event.mentions)[0];
    } 
    // If neither, prompt the user for an action
    else {
      return reply("You need to mention someone or reply to someone's message to slap them!");
    }

    // Ensure both users are identified properly
    try {
      const uid1 = event.senderID; // User who sends the command
      const uid2 = mentionedID;    // User to be slapped

      // Log to ensure IDs are fetched correctly
      console.log(`Slapping from UID: ${uid1} to UID: ${uid2}`);

      // Fetch slap image from the API
      const response = await axios.get(`${global.deku.ENDPOINT}/canvas/slap?uid=${uid1}&uid2=${uid2}`, {
        responseType: 'arraybuffer'
      });

      // Save the image temporarily to send it
      const slapImagePath = path.join(__dirname, 'slap.png');
      fs.writeFileSync(slapImagePath, response.data);

      const msg = {
        body: `Take that!`,
        attachment: fs.createReadStream(slapImagePath)
      };

      // Send the image and then clean up the file
      api.sendMessage(msg, event.threadID, () => {
        fs.unlinkSync(slapImagePath); // Clean up the file after sending
      });

    } catch (error) {
      // Handle potential API errors or local issues
      console.error("Error fetching slap image: ", error);
      reply("Sorry, something went wrong while trying to slap!");
    }
  }
};
