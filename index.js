const discordKey = process.env.DISCORD_LOGIN;
if (discordKey === undefined) {
    console.log("DISCORD_LOGIN is not set!");
    process.exit(1);
}

const { Client, Message, MessageEmbed } = require("discord.js");
const fs = require("fs");
const global = require("./global.js");

const client = new Client();

const commands = [];
const aliasedCommands = {};

var config = {
    prefix: "$",
    color: 0xAA8236,
    meetings: [],
    meeting_counter: 0
};

function writeConfigToDisk() {
    fs.writeFileSync("config.json", JSON.stringify(config));
}

function updateConfig(key, value) {
    if (value === null) {
        delete config[key];
    }
    else {
        config[key] = value;
    }
    writeConfigToDisk();
}

if (fs.existsSync("config.json")) {
    config = JSON.parse(fs.readFileSync("config.json"));
}
else {
    writeConfigToDisk();
}

fs.readdirSync('./commands').filter(file => file.endsWith('.js')).forEach(file => {
    const command = require(`./commands/${file}`);
    if (command.initialize !== undefined) {
        command.initialize(client, {
            commands: commands,
            aliasedCommands: aliasedCommands,
            config: config,
            updateConfig: updateConfig,
            global: global
        });
    }
    commands.push(command);
    command.names.forEach(element => {
        aliasedCommands[element] = command;
    });
});

client.on("ready", ()=>{
    process.on("uncaughtException", (error)=>{
        client.channels.fetch("782858462681235496", true).then((channel)=>{
            const embed = new MessageEmbed({
                title: "Hata",
                description: error.message,
                color: config["color"]
            });
            channel.send(embed);
        });
    });
    console.log("Bot is ready!");
});
client.on("message", (message)=>{
    if (!message.content.startsWith(config.prefix)) {
        // This message is not intended for this bot
        return;
    }
    const argv = message.content.substr(config.prefix.length).split(" ");
    const command = aliasedCommands[argv[0]];
    if (command === undefined) {
        // This is not a valid command
        return;
    }
    try {
        command.execute(client, message, argv, {
            commands: commands,
            aliasedCommands: aliasedCommands,
            config: config,
            updateConfig: updateConfig,
            global: global
        });
    }
    catch (err) {
        const embed = new MessageEmbed({
            title: "Hata",
            description: err.toString(),
            color: config["color"]
        });
        message.channel.send(embed);
    }
});

client.login(discordKey);