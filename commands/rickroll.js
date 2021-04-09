const { getFips } = require("crypto");
const { Client, Message, MessageEmbed } = require("discord.js");
const fs = require("fs");

let gifs = [];
fs.readdirSync('./assets').filter(file => file.endsWith('.gif')).forEach(file => {
    gifs.push(file);
});

function botatesRickRoll(client, message, argv, constants) {
    const gif = gifs[Math.floor(Math.random() * gifs.length)];
    message.channel.send("<https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be&t=42>", {files: ["./assets/" + gif]});
}

module.exports = {
    names: ["beni-admin-yap"],
    description: "Kullanıcıya admin rolü verir",
    usage: "beni-admin-yap",
    execute: botatesRickRoll
};