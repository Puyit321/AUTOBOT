const { OnChat, font } = require('chatbox-utility');

module.exports["config"] = {
    name: "owners",
    aliases: ["owner"],
    isPrefix: false,
    info: "Owners Information",
    credits: "GeoDevz69",
    cd: 5
};

module.exports["run"] = async ({ api, event }) => {
    const chat = new OnChat(api, event);
    
if (!event.isGroup) return chat.reply(font.bold("╭─『 𝗔𝗗𝗠𝗜𝗡𝗙𝗢 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚: ONLY GEORGE NAKILA MY OWNER"));

const rules = `╭─『 𝗔𝗗𝗠𝗜𝗡𝗙𝗢 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚:\n
◉ BOT NAME: GCHAT BOT
◉ BOT OWNER: Juztin
◉ HOBBY: Mangarap maging kame
◉ STATUS: SINGLE
◉ AGE: ?? YR/OLD
◉ SPORTS: BILLIARD 
◉ LOCATION: INDONESIA
◉ DREAM: MAKASAMA SYA
◉ OWNERS LINK: https://www.facebook.com/\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 𝚄𝙽𝚂𝙴𝙽𝙳 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝚃𝙷𝙴𝚂𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙵𝙾𝚁 𝙰𝙳𝙼𝙸𝙽 𝙾𝙽𝙻𝚈!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com/geotechph.net\n╰─────────────✧✧✧`;
chat.reply({ body: font.thin(rules), attachment: await chat.stream("https") });
};
