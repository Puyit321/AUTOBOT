let fontEnabled = true;

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (fontEnabled && char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

const path = require('path');
module.exports.config = {
  name: "music",
  version: "2.0.6",
  role: 0,
  hasPrefix: true,
  aliases: ['sc', 'spotify'],
  usage: 'Soundcloud [song title]',
  description: 'Play a song from SoundCloud',
  credits: 'Kaizenji',
  cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const search = args.join(' ');

  if (!search) {
    api.sendMessage(formatFont("Please provide a song title."), event.threadID, (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 3000);
    }, event.messageID);
    return;
  }

  try {
    api.sendMessage(formatFont(`Searching for "${search}"...`), event.threadID, (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 3000);
    }, event.messageID);

    const soundCloudTrackUrl = `https://betadash-search-download.vercel.app/sc?search=${encodeURIComponent(search)}`;
    const trackResponse = await axios.get(soundCloudTrackUrl, { responseType: 'arraybuffer' });

    const cacheDir = path.join(__dirname, 'cache');
    const fileName = `${Date.now()}.mp3`;
    const filePath = path.join(cacheDir, fileName);

    fs.ensureDirSync(cacheDir);
    fs.writeFileSync(filePath, Buffer.from(trackResponse.data));

    if (fs.statSync(filePath).size > 26214400) {
      fs.unlinkSync(filePath);
      return api.sendMessage(formatFont('The file could not be sent because it is larger than 25MB.'), event.threadID);
    }

    const message = {
      body: formatFont('🎧 | Here is your music.'),
      attachment: fs.createReadStream(filePath)
    };

    api.sendMessage(message, event.threadID, () => {
      fs.unlinkSync(filePath);
    }, event.messageID);

  } catch (error) {
    api.sendMessage(formatFont('An error occurred while processing the command.'), event.threadID, event.messageID);
  }
};
