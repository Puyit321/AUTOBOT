const handleReply = [];

module.exports.config = {
		name: "friends",
		version: "1.0.0",
		role: 1,
		hasPrefix: false,
		credits: "GeoDevz69",
		description: "View friends information/Delete friends by replying",
		usages: "admin",
		cooldown: 5
};

module.exports.handleReply = async function ({ api, args, Users, event }) {
		const { threadID, messageID, senderID } = event;
		const reply = handleReply.find(reply => reply.author === senderID);
		if (!reply) return;

		const { nameUser , urlUser , uidUser  } = reply;

		if (event.type === "message_reply") {
				const selectedNumbers = event.body.split(" ").map(n => parseInt(n));
				let msg = "";
				selectedNumbers.forEach(num => {
						const index = num - 1;
						if (index >= 0 && index < nameUser .length) {
								const name = nameUser [index];
								const url = urlUser [index];
								const uid = uidUser [index];

								api.unfriend(uid);
								msg += `- ${name}\nProfile URL: ${url}\n`;
						}
				});

				api.sendMessage(`Delete Friends\n\n${msg}`, threadID, () =>
						api.unsendMessage(messageID));
		}
};

module.exports.run = async function ({ event, api, args }) {
		const { threadID, messageID, senderID } = event;
		try {
				const listFriend = [];
				const dataFriend = await api.getFriendsList();
				const countFr = dataFriend.length;

				for (const friend of dataFriend) {
						listFriend.push({
								name: friend.fullName || "Unnamed",
								uid: friend.userID,
								gender: friend.gender,
								vanity: friend.vanity,
								profileUrl: friend.profileUrl
						});
				}

				const nameUser  = [], urlUser  = [], uidUser  = [];
				let page = parseInt(args[0]) || 1;
				page = Math.max(page, 1);
				const limit = 10;
				let msg = `╭─『 𝗙𝗥𝗜𝗘𝗡𝗗𝗦 』✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙎𝙚𝙣𝙩: Friends List Includes ${countFr} Persons\n\n`;
				const numPage = Math.ceil(listFriend.length / limit);

				for (let i = limit * (page - 1); i < limit * page; i++) {
						if (i >= listFriend.length) break;
						const infoFriend = listFriend[i];
						msg += `✧ ${i + 1}. ${infoFriend.name}\n✧ ID: ${infoFriend.uid}\n✧ Gender: ${infoFriend.gender}\n✧ Vanity: ${infoFriend.vanity}\n✧ Profile URL: ${infoFriend.profileUrl}\n\n`;
						nameUser .push(infoFriend.name);
						urlUser .push(infoFriend.profileUrl);
						uidUser .push(infoFriend.uid);
				}

				msg += `Page ${page}/${numPage}\nUse .friend page number/all\n\n`;

				return api.sendMessage(msg + 'Reply with the number(s) in order (from 1->10), you can reply with multiple numbers separated by spaces to delete those friends from the list!\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 '𝚄𝙽𝚂𝙴𝙽𝙳' 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸'𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉  𝚃𝙷𝙴𝚂𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙸𝙽𝚃𝙴𝙽𝙳𝙴𝙳 𝙵𝙾𝚁 𝚃𝙴𝚇𝚃 𝙵𝙾𝚁𝙼 𝙾𝙽𝙻𝚈!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧', threadID, (e, data) =>
						handleReply.push({
								author: senderID,
								messageID: data.messageID,
								nameUser ,
								urlUser ,
								uidUser 
						})
				);
		} catch (e) {
				console.log(e);
		}
      }
