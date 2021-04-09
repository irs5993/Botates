const { Client, Message, MessageEmbed } = require("discord.js");

let permittedRoles = [
    "Botates'e Fısıldayan Adam"
];

function botatesConfig(client, message, argv, constants) {
    let object = {};
    if (!constants.global.hasRole(message, permittedRoles)) {
        message.react("⛔");
        return;
    }
    if (argv[1] === "set") {
        const key = argv[2];
        argv.splice(0, 3);
        const value = JSON.parse(argv.join(" "));
        constants.config[key] = value;
        constants.updateConfig(key, value);
        object[key] = value;
    }
    else if (argv[1] === "get") {
        object[argv[2]] = constants.config[argv[2]];
    }
    else if (argv[1] === "delete") {
        constants.updateConfig(argv[2], null);
    }
    else if (argv[1] === "show") {
        object = constants.config;
    }
    else {
        /*
        message.channel.send(`
\`\`\`
Usage:
  ${constants.config.prefix}config set <key> <value>
  ${constants.config.prefix}config get <key>
  ${constants.config.prefix}config delete <key>
  ${constants.config.prefix}config show
\`\`\`
        `);
        */
        return;
    }
    message.channel.send(new MessageEmbed({
        description:`\`\`\`${JSON.stringify(object, null, 2)}\`\`\``
    }));
}

module.exports = {
    names: ["config", "cfg"],
    usage: "config set <key> <value>\nconfig get <key>\nconfig show\nconfig delete <key>\nconfig reset",
    description: "Botun ayarlarını okur veya değiştirir.",
    execute: botatesConfig
};