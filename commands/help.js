const { Client, Message, MessageEmbed } = require("discord.js");

function botatesHelp(client, message, argv, constants) {
    if (argv.length === 1) {
        const embed = new MessageEmbed({
            color: constants.config["color"],
            title: "Komutlar",
            //timestamp: new Date()
        });
        constants.commands.forEach((command)=>{
            let description = command.description;
            if (command.names.includes("help")) {
                description += `\nBir komut hakkında daha fazla bilgi almak için: \`${constants.config.prefix}help komut\``;
            }
            embed.addField(command.names.join(", "), description);
        });
        message.channel.send(embed);
        return;
    }
    const command = constants.aliasedCommands[argv[1]];
    let embed;
    if (command === undefined) {
        embed = new MessageEmbed({
            color: constants.config["color"],
            title: "Böyle bir komut yok!"
        });
    }
    else {
        embed = new MessageEmbed({
            color: constants.config["color"],
            title: command.names.join(", "),
            description:`${command.description} \`\`\`${(constants.config.prefix + command.usage).split("\n").join("\n" + constants.config.prefix)}\`\`\``
        });
    }
    message.channel.send(embed);
}

module.exports = {
    names: ["help", "h"],
    description: "Tüm komutları ya da belli bir komutun açıklamasını gösterir.",
    usage: "help [komut]",
    execute: botatesHelp
};