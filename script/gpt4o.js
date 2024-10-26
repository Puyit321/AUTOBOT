const axios = require('axios');

const gothicFont = {
  A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
  S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹", 
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
  j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
  s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
  0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
};

const convertToGothic = (hot) => {
  return hot.split('').map(ppgi => gothicFont[ppgi] || ppgi).join('');
};

module.exports.config = {
    name: 'gpt4o',
    version: '1.1.0',
    role: 0,
    hasPrefix: false,
    aliases: ['gpt4o'],
    description: 'Get a response from GPT-4o',
    usage: 'gpt4o [your message]',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const chilli = args.join(' ');

    if (!chilli) {
        return api.sendMessage('Please provide a query, for example: gpt4o writemeessayaboutAI', event.threadID, event.messageID);
    }

    const pogi = await new Promise((resolve, reject) => {
        api.sendMessage('🟡 Searching for your answer...', event.threadID, (err, hot) => {
            if (err) return reject(err);
            resolve(hot);
        }, event.messageID);
    });

    const apiUrl = `https://joshweb.click/api/gpt-4o?q=${encodeURIComponent(chilli)}&uid=1`;

    try {
        const hot = await axios.get(apiUrl);
        const gpt4oResponse = hot.data.result || 'No response from GPT-4o.';

        const gothicResponse = convertToGothic(gpt4oResponse);

        await api.editMessage(gothicResponse, pogi.messageID);

    } catch (chilli) {
        console.error('Error:', chilli);

        await api.editMessage('❌ An error occurred while fetching the response. Please try again later.', pogi.messageID);
    }
};
