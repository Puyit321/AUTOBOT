const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "whysoquiet",
  aliases: ["wsq"],
  credits: "Vex_Kshitiz",
  version: "2.0",
  cooldowns: 10,
  hasPrefix: false,
  role: 0,
  description: "Get random wsq video",
  commandCategory: "fun",
  usages: "{p}shoti",
};

module.exports.run = async function ({ api, event}) {
  api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

  try {
    const response = await axios.get("https://whysoquite.onrender.com/kshitiz");
    const postData = response.data.posts;
    const randomIndex = Math.floor(Math.random() * postData.length);
    const randomPost = postData[randomIndex];

    const videoUrls = randomPost.map(url => url.replace(/\\/g, "/"));

    const selectedUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

    const videoResponse = await axios.get(selectedUrl, { responseType: "stream" });

    const tempVideoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);
    const writer = fs.createWriteStream(tempVideoPath);
    videoResponse.data.pipe(writer);

    writer.on("finish", async () => {
      await api.sendMessage({
        body: ``,
        attachment: fs.createReadStream(tempVideoPath),
      },
      event.threadID,
      event.messageID
    );
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      fs.unlink(tempVideoPath, (err) => {
        if (err) console.error(err);
        console.log(`Deleted ${tempVideoPath}`);
      });
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("Sorry, an error occurred while processing your request.");
  }
};
