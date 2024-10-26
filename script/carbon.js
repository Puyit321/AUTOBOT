const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function streamUrl(url = "", pathName = "", options = {}) {
    if (!options && typeof pathName === "object") {
        options = pathName;
        pathName = "";
    }
    try {
        if (!url || typeof url !== "string")
            throw new Error(`The first argument (url) must be a string`);

        url += "&direction=vertical";

        const response = await axios({
            url,
            method: "GET",
            responseType: "stream",
            ...options
        });
        if (!pathName)
            pathName = uuidv4() + (response.headers["content-type"] ? '.' + await getExtFromMimeType(response.headers["content-type"]) : ".noext");
        response.data.path = pathName;
        return response.data;
    }
    catch (err) {
        throw err;
    }
}

async function getExtFromMimeType(mimeType) {
    const extMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/bmp': 'bmp'
    };
    return extMap[mimeType] || 'txt';
}

async function sendMessage(msg) {
  api.sendMessage(msg, event.threadID, event.messageID);
}

module.exports.config = {
    name: 'carbon',
    version: '1.0.0',
    role: 0,
    hasPermission: 0,
    description: "Create an image with code snippet",
    usage: "{pn} <text> ",
    usages: "{pn} <text> ",
    credits: 'cliff',//owner api samir
    cooldown: 0,
    hasPrefix: false,
    aliases: ["carbon", "snipe"],
    cooldowns: 5,
    usePrefix: false,
    commandCategory: "image",
};

module.exports.run = async function ({ api, event, args }) {
    const text = args.join(" ");

    if (!text) {
        return api.sendMessage("Please provide a Text to be placed on the Image/png", event.threadID);
    }

    const messageInfo = await api.sendMessage("Initializing image, please wait...", event.threadID);

    try {
        const API = `https://www.samirxpikachu.run.place/snippet?code=${encodeURIComponent(text)}&backgroundColor=gray&fontSize=25px&theme=Seti`;
        const imageStream = await streamUrl(API);
        
        const messageId = messageInfo.messageID;
        api.unsendMessage(messageId);
        await api.sendMessage({
            body: `Generated carbon successfully\n\nVisit this site to see more available themes: https://carbon.now.sh/`,
            attachment: imageStream
        }, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error}`, event.threadID);
    }
};
