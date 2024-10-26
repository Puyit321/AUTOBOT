const axios = require("axios");

module.exports.config = {
    name: "tempnum",
    version: "1.0",
    author: "Samir",
    countDown: 5,
    hasPrefix: false,
    cooldown: 5,
    role: 0,
    description: {
        en: "generate temporary phone numbers and retrieve inbox messages",
        vi: "generate temporary phone numbers and retrieve inbox messages",
    },
    longDescription: {
        en: "generate temporary phone numbers and retrieve inbox messages",
        vi: "generate temporary phone numbers and retrieve inbox messages",
    },
    commandCategory: "tool",
    guide: {
        en: "{pn} gen (1-10)\n{pn} inbox (number) | (1-10)",
        vi: "{pn} gen (1-10)\n{pn} inbox (number) | (1-10)",
    },
};

module.exports.run = async function ({ api, args, event }) {
    const command = args[0];

    try {
        if (command === "gen") {
            let num = args[1];

            num = num || 1;

            if (isNaN(num) || num < 1 || num > 10) {
                return api.sendMessage("Please provide a valid number between 1 and 10 for generating temporary phone numbers.", event.threadID);
            }

            const response = await axios.get(`https://www.samirxpikachu.run.place/api/numbers/PHILIPPINES`);
            const tempNumbers = response.data.slice(0, num);

            const formattedNumbers = tempNumbers.map((tempNum) => {
                return `Country: ${tempNum.country}\nNumber: ${tempNum.phoneNumber}`;
            });

            return api.sendMessage(`Generated temporary numbers:\n\n${formattedNumbers.join("\n\n")}`, event.threadID);

        } else if (command === "inbox") {
            let [phone, num] = args.slice(1).join(" ").split("|").map((str) => str.trim());

            if (!phone || isNaN(phone)) {
                return api.sendMessage("Please provide a valid phone number for retrieving inbox messages.", event.threadID);
            }

            num = num || 1;

            if (isNaN(num) || num < 1 || num > 10) {
                return api.sendMessage("Please provide a valid number between 1 and 10 for retrieving inbox messages.", event.threadID);
            }

            const inboxResponse = await axios.get(`https://www.samirxpikachu.run.place/api/messages/${phone}`);
            const inboxMessages = inboxResponse.data.slice(0, num);

            const formattedMessages = inboxMessages.map((message) => {
                return `From: ${message.from}\nContent: ${message.content}`;
            });

            return api.sendMessage(`Inbox messages for ${phone}:\n\n${formattedMessages.join("\n\n")}`, event.threadID);

        } else {
            return api.sendMessage("Invalid command. Use {pn} gen (1-10) or {pn} inbox (number) | (1-10).", event.threadID);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("An error occurred. Please try again later.", event.threadID);
    }
};
