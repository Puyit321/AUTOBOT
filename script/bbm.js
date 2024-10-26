const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const axios = require('axios');

const wrapText = (ctx, text, maxWidth) => {
    return new Promise((resolve) => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
        const lines = [];
        let line = '';
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
            else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
};

module.exports.config = {
    name: "bbm",
    version: "1.0.0",
    role: 0,
    credits: "Hinata",
    hasPrefix: true,
    description: "bbm memes",
    commandCategory: "memes",
    usage: "text 1 | text 2",
    cooldowns: 1
};

module.exports.run = async function ({ api, event, args, Users }) {
    const pathImg = __dirname + `/cache/meme.jpg`;
    const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");

    try {
        const getImage = (await axios.get(encodeURI(`https://i.imgflip.com/8nihc7.jpg`), {
            responseType: "arraybuffer",
        })).data;
        fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial"; // Using system font
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        const line = await wrapText(ctx, text[0], 464);
        const lines = await wrapText(ctx, text[1], 464);
        ctx.fillText(line.join("\n"), 464, 129)
        ctx.fillText(lines.join("\n"), 464, 339)
        ctx.beginPath();
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        return api.sendMessage(
            { attachment: fs.createReadStream(pathImg) },
            event.threadID,
            () => fs.unlinkSync(pathImg),
            event.messageID
        );
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing the command", event.threadID, event.messageID);
    }
};
