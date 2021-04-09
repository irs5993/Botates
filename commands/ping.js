const { Client, Message, MessageEmbed } = require("discord.js");

function botatesPing(client, message, argv, constants) {
    const delay = Math.abs(Date.now() - message.createdTimestamp);
    message.channel.send(`Pong! (${delay} ms)`);
}

module.exports = {
    names: ["ping", "p"],
    description: "Botu test etmek için basit bir komut. \"Pong!\" ile cevap verir.",
    usage: "ping",
    execute: botatesPing
};