module.exports.config = {
  name: "prefix",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Marjhun Baylon",
  description: "prefix",
  usePrefix: "false",
  commandCategory: "system",
  usages: "[Name module]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 20
  }
};

module.exports.run = async function({ api, event }) {

  api.sendMessage(`╭┈ ❒ MY PREFIX\n╰┈➤ ${global.config.PREFIX}\n╭┈ ❒ Type this for educ.\n╰┈➤ [ ai ] - [ Ai ]`,

  event.threadID, event.messageID);


}
