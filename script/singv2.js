const path = require('path');
module.exports.config = {
  name: "singv2",
  version: "2.0.6",
  role: 0,
  hasPrefix: true,
  aliases: ['play'],
  usage: 'sing [song title]',
  description: 'Play a song from YouTube',
  credits: 'Kaizenji',
  cooldown: 5,
};

const fontEnabled = true;

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

module.exports.run = async function({ api, event, args }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const search = args.join(' ');

  if (!search) {
    api.sendMessage(formatFont("❌ | Please provide a song title."), event.threadID, (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 3000);
    }, event.messageID);
    return;
  }

  try {
    api.sendMessage(formatFont(`Searching for "${search}"...`), event.threadID, (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 3000);
    }, event.messageID);

    const youtubeTrackUrl = `https://kaiz-audiomp3.vercel.app/ytmp3?q=${encodeURIComponent(search)}`;
    const trackResponse = await axios.get(youtubeTrackUrl);

    if (!trackResponse.data.mp3Link) {
      return api.sendMessage(formatFont("No results found."), event.threadID, event.messageID);
    }

    const { title, mp3Link, duration, thumbnail } = trackResponse.data;
    
    
    const thumbnailPath = path.join(__dirname, 'cache', `${Date.now()}.jpg`);
    const thumbnailBuffer = await axios.get(thumbnail, { responseType: 'arraybuffer' });
    fs.writeFileSync(thumbnailPath, Buffer.from(thumbnailBuffer.data));
    
    api.sendMessage({
      body: '',
      attachment: fs.createReadStream(thumbnailPath)
    }, event.threadID, async () => {
      fs.unlinkSync(thumbnailPath);
      
    
      const mp3Path = path.join(__dirname, 'cache', `${Date.now()}.mp3`);
      const mp3Buffer = await axios.get(mp3Link, { responseType: 'arraybuffer' });
      fs.writeFileSync(mp3Path, Buffer.from(mp3Buffer.data));

      if (fs.statSync(mp3Path).size > 26214400) {
        fs.unlinkSync(mp3Path);
        return api.sendMessage(formatFont('The file could not be sent because it is larger than 25MB.'), event.threadID);
      }

      const message = {
        body: formatFont(`🎧 | Title: ${title}\n⏳ | Duration: ${duration}`),
        attachment: fs.createReadStream(mp3Path)
      };

      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(mp3Path);
      }, event.messageID);
    });

  } catch (error) {
    api.sendMessage(formatFont('An error occurred while processing the command.'), event.threadID, event.messageID);
  }
};
