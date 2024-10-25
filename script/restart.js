module.exports.config = {
    name: "restart",
    version: "1.0.0",
    role: 2,
    credits: "Mirai Team",
    description: "Restart Bot",
    hasPrefix: false,
    commandCategory: "system",
    usages: "restart",
    cooldowns: 0
};

const fs = require("fs-extra");

module.exports.handleEvent = async function ({ api, admin }) {
    const pathFile = `${__dirname}/../cache/restart.txt`;
    if (fs.existsSync(pathFile)) {
        const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
        api.sendMessage(`✅ | Bot restarted\n⏰ | Time: ${(Date.now() - time) / 1000}s`, tid, admin);
        fs.unlinkSync(pathFile);
    }
};

module.exports.run = async function ({ api, event }) {
    const pathFile = `${__dirname}/../cache/restart.txt`;
    fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
    await api.sendMessage("🔴🟢🟡 Bot is now restarting...", event.threadID);
    process.exit(2);
};
