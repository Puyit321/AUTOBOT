const axios = require("axios");

module.exports.config = {
    name: "tokengetter",
    version: "1.0.0",
    role: 0,
    credits: "chilli",
    description: "Get EAAD6V7 and EAAAAU tokens and cookies",
    hasPrefix: true,
    aliases: ["gettokens"],
    usage: "[tokengetter <username> | <password>]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const input = args.join(" ");
    const [username, password] = input.split(" | ");

    if (!username || !password) {
        api.sendMessage("Usage: tokengetter <username> | <password>", event.threadID);
        return;
    }

    const resultMessage = "⏱️ | Getting token and cookie, please wait...";
    api.sendMessage(resultMessage, event.threadID);

    try {
        const response = await axios.get(`https://markdevs-last-api-as2j.onrender.com/api/token&cookie`, {
            params: {
                username,
                password
            }
        });

        const { access_token_eaad6v7, access_token, cookies } = response.data.data;

        const message = `
Generated Tokens and Cookie:

EAAD6V7 TOKEN:
${access_token_eaad6v7}

EAAAAU TOKEN:
${access_token}

COOKIE:
${cookies}
`;

        api.sendMessage(message, event.threadID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while getting the tokens and cookie.", event.threadID);
    }
};
