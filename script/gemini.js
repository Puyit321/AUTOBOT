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

const axios = require('axios');

module.exports.config = {
  name: "gemini",
  role: 0,
  credits: "developer",
  description: "Interact with Gemini",
  hasPrefix: false,
  version: "1.0.0",
  aliases: ["gemi"],
  cooldown: 0,
  usage: "gemini [prompt or reply to photo]"
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(" ");
  const userUid = event.senderID;

  if (!prompt && (!event.messageReply || event.messageReply.attachments[0]?.type !== "photo")) {
    return api.sendMessage(formatFont('❌ | Please provide a prompt or reply to a photo.'), event.threadID, (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 3000);
    }, event.messageID);
  }

  let fileUrl = '';
  if (event.messageReply && event.messageReply.attachments[0]?.type === "photo") {
    fileUrl = encodeURIComponent(event.messageReply.attachments[0].url);
  }

  try {
    const apiUrl = `https://rest-api-production-5054.up.railway.app/gemini?prompt=${encodeURIComponent(prompt)}&model=gemini-1.5-flash&uid=${userUid}` + (fileUrl ? `&file_url=${fileUrl}` : '');

    const response = await axios.get(apiUrl);
    const description = response.data.message;

    return api.sendMessage(formatFont(description), event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage(formatFont('❌ | An error occurred while processing your request.'), event.threadID, event.messageID);
  }
};
