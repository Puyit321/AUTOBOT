const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');

module.exports["config"] = {
    name: "musiclyrics",
    version: "1.0.0",
    info: "Search music from SoundCloud and send it as an attachment.",
    credits: "GeoDevz69",
    isPrefix: false,
    role: 0,
    aliases: ['play',
        'sing',
        'song',
        'kanta',
        'spotify',
        'lyrics',
        'lyric',
        'lyrist',
        'soundcloud',
        'sc'],
    usage: '[title]',
};

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.6 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15"
];

module.exports["run"] = async ({
    api, event, args
}) => {
    const chat = {
        reply: (txt) => api.sendMessage(txt, event.threadID)
    };

    const musicName = args.join(' ');

    if (!musicName) {
        return chat.reply(`╭─『 𝗠𝗨𝗦𝗜𝗖 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚:Please provide the title of the music!\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 '𝚄𝙽𝚂𝙴𝙽𝙳' 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸'𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝙿𝙻𝙴𝙰𝚂𝙴 𝙳𝙾𝙽'𝚃 𝚂𝙿𝙰𝙼 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧`);
    }

    const searching = await chat.reply(`╭─『 𝗠𝗨𝗦𝗜𝗖 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚: 🔍 | Searching for "${musicName}"...\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 '𝚄𝙽𝚂𝙴𝙽𝙳' 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸'𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝙿𝙻𝙴𝙰𝚂𝙴 𝙳𝙾𝙽'𝚃 𝚂𝙿𝙰𝙼 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧`);

    let filePath;
    try {
        // Request music data from the custom API
        const response = await axios.get(`https://rest-api-production-5054.up.railway.app/soundcloud?query=${encodeURIComponent(musicName)}`, {
            headers: {
                'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
            }
        });

        const {
            title,
            lyrics,
            audio_b64
        } = response.data;

        if (!title || !audio_b64) {
            return chat.reply("╭─『 𝗠𝗨𝗦𝗜𝗖 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚: Can't find the music you're looking for.\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 '𝚄𝙽𝚂𝙴𝙽𝙳' 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸'𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝙿𝙻𝙴𝙰𝚂𝙴 𝙳𝙾𝙽'𝚃 𝚂𝙿𝙰𝙼 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧");
        }

        // Create a temporary file to save the music from the base64 string
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        filePath = path.join(__dirname, 'cache', `${timestamp}_music.mp3`);
        const audioBuffer = Buffer.from(audio_b64, 'base64');
        fs.writeFileSync(filePath, audioBuffer);

        if (fs.statSync(filePath).size > 26214400) {
            // Check if the file size is greater than 25MB
            fs.unlinkSync(filePath);
            return chat.reply('The file could not be sent because it is larger than 25MB.');
        }

        const message = {
            body: `${title}`,
            attachment: fs.createReadStream(filePath)
        };

        if (lyrics) await chat.reply(lyrics);

         chat.reply(message);

    } catch (error) {
        chat.reply(error.message || "╭─『 𝗠𝗨𝗦𝗜𝗖 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚:An error occurred while fetching the music.\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 '𝚄𝙽𝚂𝙴𝙽𝙳' 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸'𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝙿𝙻𝙴𝙰𝚂𝙴 𝙳𝙾𝙽'𝚃 𝚂𝙿𝙰𝙼 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧");
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Clean up the temporary file
        }
    }
};
