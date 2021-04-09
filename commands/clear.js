const { Client, Message, MessageEmbed } = require("discord.js");

function botatesClear(client, message, argv, constants) {
    let limit = parseInt(argv[1]);
    if(limit > 100) {limit = 100;}
    if (isNaN(limit)) throw new Error("Message count was not a number.");
    message.channel.messages.fetch({ limit: limit }).then(messages => {
        message.channel.bulkDelete(messages);
    });
}

module.exports = {
    names: ["clear"],
    description: "Kanalı temizler.",
    usage: "clear",
    execute: botatesClear
};