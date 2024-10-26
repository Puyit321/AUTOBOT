const { get } = require('axios');
const fs = require('fs');
const path = require('path');

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.config = {
  name: "batmanslap",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "",
  usages: "{p}{n} mention",
  cooldown: 5,
  aliases: ["slap"]
};

module.exports.run = async function ({ api, event, args }) {
  const mentionID = Object.keys(event.mentions)[0];
  if (!mentionID) {
    return api.sendMessage('Please mention a user to slap!', event.threadID, event.messageID);
  }

  const userInfo = await api.getUserInfo(mentionID);
  const realName = userInfo[mentionID].name;

  const senderID = event.senderID;
  const url = `https://hiroshi-rest-api.replit.app/canvas/batmanslap?batman=${senderID}&robin=${mentionID}`;
  const filePath = path.join(__dirname, 'cache', 'slap.png');

  try {
    let response = await get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, Buffer.from(response.data, "utf8"));
    let name = await getUserName(api, event.senderID);
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    });
    api.sendMessage({ body: `${realName} slapped by ${name}`, attachment: fs.createReadStream(filePath) }, event.threadID, () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
