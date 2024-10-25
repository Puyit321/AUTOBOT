module.exports.config = {
    name: "welcomenoti",
    version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
    const logMessageType = event.logMessageType;
    const threadID = event.threadID;

    if (logMessageType === "log:subscribe") {
        try {
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            let addedParticipants = event.logMessageData.addedParticipants;

            for (let newParticipant of addedParticipants) {
                let userID = newParticipant.userFbId;

                if (userID !== api.getCurrentUserID()) {
                    api.shareContact(
                        `👋 Hello! Welcome to ${threadName || "this group"} 🤗, you're the ${participantIDs.length}th member on this group. Enjoy! 🤗`,
                        userID,
                        threadID
                    );
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }
};
