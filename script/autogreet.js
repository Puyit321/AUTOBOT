const moment = require('moment-timezone');

module.exports.config = {
  name: "autogreet",
  version: "2.0.0",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "",
  usage: "{p}{n} on / off",
  category: "AutoTime",
  cooldown: 0
};

let isGreetOn = true;

module.exports.run = async function ({ api, event, args }) {
  if (args.length === 0) {
    api.sendMessage("Usage: greet on / off", event.threadID, event.messageID);
    return;
  }

  if (args[0] === "on") {
    isGreetOn = true;
    api.sendMessage("Greetings has been turned on.", event.threadID, event.messageID);
  } else if (args[0] === "off") {
    isGreetOn = false;
    api.sendMessage("Greetings has been turned off.", event.threadID, event.messageID);
  } else {
    api.sendMessage("Invalid Usage: autogreet on / off", event.threadID, event.messageID);
    return;
  }


  const checkTimeAndSendMessage = async () => {
    if (!isGreetOn) {
      return;
    }

    const arrayData = {
      "12:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 12:00 PM\n\n📌 good afternoon everyone, don't forget to eat y'all lunch break🍛"
      },
      "01:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 01:00 AM\n\n📌 good morning everyone!! Have a nice morning🥪☕🌄"
      },
      "02:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 02:00 AM\n\n📌 don't forget to add/follow my owner😊."
      },
      "03:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 03:00 AM\n\n📌 aga nyo nagising ahh"
      },
      "04:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 04:00 AM\n\n📌 eyyy🤙 don't panic it's organic eyyyyy🤙"
      },
      "05:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 05:00 AM\n\n📌 aga nyo nagising ahh sanaol strong💪🙏"
      },
      "06:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 06:00 AM\n\n📌 kape muna kayo☕"
      },
      "07:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 07:00 AM\n\n📌 don't forget to eat y'all breakfast!! 🥪☕🍛"
      },
      "08:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 08:00 AM\n\n📌 life update: pogi parin owner ko"
      },
      "09:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 09:00 AM\n\n📌 baka hinde pa kayo kumain, kain na kayo💪🙏"
      },
      "10:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 10:00 AM\n\n📌 wag mo kalimutan e chat owner ko💪🙏"
      },
      "11:00:00 AM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 11:00 AM\n\n📌 hinde mababawasan kapogian ng owner ko, btw have a nice morning everyone!"
      },
      "12:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 12:00 𝐏𝐌\n\n📌 kain na kayo mga lods💪"
      },
      "01:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 01:00 𝐏𝐌\n\n📌 don't forget to eat y'all lunch break😋"
      },
      "02:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 02:00 𝐏𝐌\n\n📌 good afternoon!! My owner is so handsome asf"
      },
      "03:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 03:00 𝐏𝐌\n\n📌 miss ko na sya:("
      },
      "04:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 04:00 𝐏𝐌\n\n📌 magandang hapon mga lods😋"
      },
      "05:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 05:00 𝐏𝐌\n\n📌 pogi ng owner ko na  😎"
      },
      "06:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 06:00 𝐏𝐌\n\n📌 don't forget to eat y'all dinner💪🙏"
      },
      "07:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 07:00 𝐏𝐌\n\n📌 ano silbe ng pag online mo kung hinde mo din naman e chachat owner ko😎"
      },
      "08:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 08:00 𝐏𝐌\n\n📌 kumain naba kayo?"
      },
      "09:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 09:00 𝐏𝐌\n\n📌 matulog na kayo mga hangal😋"
      },
      "10:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 10:00 𝐏𝐌\n\n📌 gabi na nag puyat parin kayo💪🙏"
      },
      "11:00:00 PM": {
        message: "𝗔𝗨𝗧𝗢𝗚𝗥𝗘𝗘𝗧\n▬▬▬▬▬▬▬▬▬▬▬▬\n⏰ time now - 11:00 𝐏𝐌\n\n📌 hinde mababawasan kapogian ng owner ko."
      }
    };

    const now = moment().tz('Asia/Manila');
    const currentTime = now.format('hh:mm:ss A');

    const messageData = arrayData[currentTime];

    if (messageData) {
      try {
        const threadID = event.threadID;
        api.sendMessage({ body: messageData.message }, threadID);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    const nextMinute = moment().add(1, 'minute').startOf('minute');
    const delay = nextMinute.diff(moment());
    setTimeout(checkTimeAndSendMessage, delay);
  };

  checkTimeAndSendMessage();
}
