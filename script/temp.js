const { TempMail } = require("1secmail-api");

function generateRandomId() {
		var length = 6;
		var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var randomId = '';

		for (var i = 0; i < length; i++) {
				randomId += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		return randomId;
}

module.exports.config = {
		name: "tempm",
		role: 0,
		credits: "GeoDevz69",
		description: "╭─『 𝗧𝗘𝗠𝗣𝗠𝗔𝗜𝗟 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚: Generate temporary email (auto get inbox)\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 '𝚄𝙽𝚂𝙴𝙽𝙳' 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸'𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝚄𝚂𝙴 𝚃𝙷𝙴 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳 𝙴𝙼𝙰𝙸𝙻 𝚃𝙾 𝙶𝙴𝚃 𝚈𝙾𝚄𝚁 𝙾𝚃𝙿 𝙲𝙾𝙳𝙴 𝙷𝙴𝚁𝙴!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧",
		usages: "[tempmail]",
		hasPrefix: false,
		cooldown: 5,
		aliases: ["temp"]
};

module.exports.run = async function ({ api, event }) {
		const reply = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

		try {
				// Generate temporary email
				const mail = new TempMail(generateRandomId());

				// Auto fetch
				mail.autoFetch();

				if (mail) reply("Your temporary email: " + mail.address);

				// Fetch function
				const fetch = () => {
						mail.getMail().then((mails) => {
								if (!mails[0]) {
										return;
								} else {
										let b = mails[0];
										var msg = `╭─『 𝗧𝗘𝗠𝗣𝗠𝗔𝗜𝗟 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙍𝙚𝙨𝙥𝙤𝙣𝙨𝙚:You have a message!\n\nFrom: ${b.from}\n\nSubject: ${b.subject}\n\nMessage: ${b.textBody}\nDate: ${b.date}`;
										reply(msg + `\n\nOnce the email and message are received, they will be automatically deleted.\n╰─────────────✧✧✧\n◉ 𝚁𝙴𝙿𝙻𝚈 '𝚄𝙽𝚂𝙴𝙽𝙳' 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙰𝙸'𝚜 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴.\n◉ 𝚄𝚂𝙴 𝚃𝙷𝙴 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳 𝙴𝙼𝙰𝙸𝙻 𝚃𝙾 𝙶𝙴𝚃 𝚈𝙾𝚄𝚁 𝙾𝚃𝙿 𝙲𝙾𝙳𝙴 𝙷𝙴𝚁𝙴!\n╭✧✧✧───────────✧\n    »𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙰𝙸 𝙾𝚆𝙽𝙴𝚁«\nhttps://www.facebook.com\n╰─────────────✧✧✧`);
										return mail.deleteMail();
								}
						});
				};

				// Auto fetch every 3 seconds
				fetch();
				setInterval(fetch, 3 * 1000);

		} catch (err) {
				console.log(err);
				return reply(err.message);
		}
};
