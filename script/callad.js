async function getUserName(api, senderID) {

  try {

    const userInfo = await api.getUserInfo(senderID);

    return userInfo[senderID]?.name || "User";

  } catch (error) {

    console.log(error);

    return "User";

  }

}



module.exports.config = {

  name: "callad",

  version: "1.0.1",

  role: 0,

  credits: "Cliff",

  description: "Report bot's error to admin or comment",

  hasPrefix: false,

  commandCategory: "report",

  usages: "[Error encountered or comments]",

  cooldowns: 10

};



module.exports["run"] = async function({ api, event, args, admin }) {

  if (!args[0]) return api.sendMessage("You have not entered the content to report", event.threadID, event.messageID);



  const name = await getUserName(api, event.senderID);

  let mentions = [];

    mentions.push({

        tag: name,

        id: event.senderID,

    });

  var t = event.senderID,

      d = event.threadID;

  let threadInfo = await api.getThreadInfo(event.threadID);

  var l = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");



  api.sendMessage(`Your report has been sent to the bot admin successfull\nAt: ${l}`, event.threadID, () => {

    var s = admin;

    for (let o of s) {

      let s = threadInfo.threadName || "Unnamed";

      api.shareContact(`▱▱▱[𝗖𝗔𝗟𝗟 𝗔𝗗𝗠𝗜𝗡]▱▱▱\n\n- User Name: ${name}\n- User ID: ${t}\n- Sent from group: ${threadInfo.threadName}\n- Thread ID: ${d}\n\nContent:\n─────────────────\n${args.join(" ")}\n─────────────────\nTime: ${l}`, t, o, (err, message) => {

        if (!err) {

          event.messageReply.senderID({

            name: module.exports.config.name,

            messageID: message.messageID,

            author: event.senderID,

            messID: event.messageID,

            id: d,

            type: event.type

          });

        }

      });

    }

  });

};
