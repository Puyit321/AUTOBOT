const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "trash",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    aliases: ["bin"],
    description: "Trash a user with a funny image",
    usage: "trash @mention or reply to a user",
    credits: "chill",
    cooldown: 3
};

module.exports.run = async function({ api, event }) {
    let chilli;
    let pogi;
    const bundat = event.senderID;

    if (event.messageReply) {
        chilli = event.messageReply.senderID;
        pogi = (await api.getUserInfo(chilli))[chilli].name;
    } else if (Object.keys(event.mentions).length > 0) {
        chilli = Object.keys(event.mentions)[0];
        pogi = event.mentions[chilli];
    } else {
        return api.sendMessage("You need to reply to a user or mention someone to trash them.", event.threadID, event.messageID);
    }

    const bilat = (await api.getUserInfo(bundat))[bundat].name;

    const pangit = await new Promise((resolve, reject) => {
        api.sendMessage(`🚮 Processing trash for ${pogi}...`, event.threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        }, event.messageID);
    });

    try {
        const apiUrl = `https://deku-rest-apis.ooguy.com/canvas/delete?uid=${chilli}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const imagePath = path.join(__dirname, 'trash.jpg');
        fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

        const msgOptions = {
            body: `🗑️ ${bilat} has trashed ${pogi}!`,
            attachment: fs.createReadStream(imagePath)
        };

        await api.sendMessage(msgOptions, event.threadID);

        fs.unlinkSync(imagePath);
        api.unsendMessage(pangit.messageID);

    } catch (bilat) {
        console.error('Error:', bilat);
        await api.editMessage("❌ Failed to process the trash request. Please try again.", pangit.messageID);
    }
};
