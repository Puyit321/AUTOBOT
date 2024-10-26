module.exports.config = {
	name: "randomedit",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Jonell Magallanes",
	description: "Random edit from TikTok",
	commandCategory: "media",
	cooldowns: 20,
	dependencies: {
		"axios": ""
	}
};

const axios = require("axios");
const fs = require("fs");

module.exports.run = async function({ api, event, args, client, __GLOBAL }) {
 
  api.sendMessage("⏱️ | Sending Random edit Just Please wait...", event.threadID, event.messageID); api.setMessageReaction("⏱️", event.messageID, () => { }, true);
  const response = await axios.get('https://basta-ganon.jonellmagallan1.repl.co/randomedit', {
		responseType: 'arraybuffer'
	}).catch(error => {
		api.sendMessage("Error fetching video.", event.threadID, event.messageID);
		console.error(error);
		return;
	});
  
	if (response && response.status === 200) {
		const filePath = __dirname + "/cache/randomedit.mp4";
		fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'), "binary"); api.setMessageReaction("✅", event.messageID, () => { }, true);
    const tid = event.threadID
		api.sendMessage({
			body: `Here's your Random Edit Video from TikTok\n\nID:${tid}`,
			attachment: fs.createReadStream(filePath)
		}, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
	} else {
		api.sendMessage("Failed to retrieve a video.", event.threadID, event.messageID); api.setMessageReaction("🔭", event.messageID, () => { }, true);
	}
};
