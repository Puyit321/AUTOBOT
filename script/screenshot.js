const { get } = require('axios');
const fs = require('fs');
const path = require('path');

let url = "https://www.noobs-api.000.pe/dipto";
let f = path.join(__dirname, 'cache', 'ss.png');

module.exports.config = {
    name: "screenshot",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: "cliff",
    description: "screenshot web",
    usages: "[url]",
    cooldown: 5,
    aliases: ["ss"]
};

module.exports["run"] = async function ({ api, event, args }) {
    function r(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    const a = args.join(" ");
    if (!a) return r('provide url first!');

    const cliff = await new Promise(resolve => { api.sendMessage(`Taking screenshot for ${a}...`, event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });
    try {
        const d = (await get(url + '/ss?url=' + encodeURIComponent(a), {
            responseType: 'arraybuffer'
        })).data;
        fs.writeFileSync(f, Buffer.from(d, "utf8"));
        return r({ body: `Here's your screenshot of ${a}`, attachment: fs.createReadStream(f) });
    } catch (e) {
        return r(e.message);
    }
};
