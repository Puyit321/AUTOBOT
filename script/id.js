module.exports = {
    name: "id",
    execute(api, event, args) {
        const userID = event.senderID;
        api.sendMessage(`Your User ID is: ${userID}`, event.threadID, event.messageID);
    }
};
