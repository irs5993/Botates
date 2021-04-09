const { Client, Message, MessageEmbed } = require("discord.js");

var client;
var updateConfig;
var config;
let _constants;

let canSetMeeting = [
    "Botates'e Fısıldayan Adam"
];

// Seconds
const CHECK_INTERVAL = 30;

setInterval(() => {
    if(config && client && _constants) {
        let current = new Date();
        let meetings = config["meetings"];
        meetings.forEach(meeting => {
            if(!meeting.ping[0] && !meeting.ping[1] && !meeting.ping[2]) {
                let diff = new Date(meeting.date) - current;
                if(diff <= 86400000) {
                    client.channels.fetch("783365295980281887", true).then((channel)=>{
                        channel.send(meeting.topic + " Toplantısına 24 Saat Kaldı! @everyone");
                        channel.send(_constants.global.generateMeetingsEmbed(meetings));
                    });
                    meeting.ping[0] = true;
                }
            } else if(meeting.ping[0] && !meeting.ping[1] && !meeting.ping[2]) {
                let diff = new Date(meeting.date) - current;
                if(diff <= 1800000) {
                    client.channels.fetch("783365295980281887", true).then((channel)=>{
                        channel.send(meeting.topic + " Toplantısına 30 Dakika Kaldı! @everyone");
                        channel.send(_constants.global.generateMeetingsEmbed(meetings));
                    });
                    meeting.ping[1] = true;
                }
            } else if(meeting.ping[0] && meeting.ping[1] && !meeting.ping[2]) {
                let diff = new Date(meeting.date) - current;
                if(diff <= 0) {
                    client.channels.fetch("783365295980281887", true).then((channel)=>{
                        channel.send(meeting.topic + " Toplantısı Başladı! @everyone");
                        channel.send("https://discord.gg/vGTQtcyMC3");
                    });
                    meeting.ping[2] = true;
                    setTimeout(() => {
                        meetings.splice(meetings.indexOf(meeting));
                        updateConfig("meetings", meetings);
                    }, 1000);
                }
            }
        });
    }
    
}, CHECK_INTERVAL * 1000);


function botatesMeeting(client, message, argv, constants) {
    const referenceDate = new Date();
    config = constants.config;
    let meetings = config["meetings"];
    let globalID = config["meeting_counter"];
    if(argv.length === 1) {
        let embed = constants.global.generateMeetingsEmbed(meetings);
        message.channel.send(embed);
    }
    else {
        if(argv[1] === "add") {
            if(constants.global.hasRole(message, canSetMeeting)) {
                if(argv.length == 5) {
                    let meeting = {};
        
                    let day_month = argv[3].split('/');
                    let hour_minute = argv[4].split(':');
                    
                    if(parseInt(day_month[0]) >= 0 && parseInt(day_month[1]) >= 0 && parseInt(hour_minute[0]) >= 0 && parseInt(hour_minute[1]) >= 0) {
                        let date = new Date(
                            referenceDate.getFullYear(),
                            (parseInt(day_month[1]) - 1).toString(),
                            day_month[0],
            
                            hour_minute[0],
                            hour_minute[1]
                        );
            
                        meeting.id = globalID++;
                        meeting.topic = argv[2];

                        meeting.date = date.toString();
                            
                        let diff = new Date(meeting.date) - new Date();
                        
                        if(diff >= 86400000) {meeting.ping = [false, false, false];}
                        else if(diff >= 1800000 && diff < 86400000) {meeting.ping = [true, false, false];}
                        else if(diff >= 0 && diff < 1800000) {meeting.ping = [true, true, false];}
                        else if(diff < 0) {meeting.ping = [true, true, true];}

                        const embed = new MessageEmbed({
                            color: 0xff0000,
                            title: meeting.topic + " Toplantısı",
                            description: date.getDate() + "/" + (parseInt(date.getMonth()) + 1).toString() + "\n" + date.getHours() + ":" + date.getMinutes(),  
                            footer: {
                                text: "id: " + meeting.id
                            }
                        });

                        message.react("👌");
                        message.reply("Meeting created!");
                        message.channel.send(embed);

                        meetings.push(meeting);
                        meetings.sort(constants.global.byDate);

                        constants.updateConfig("meetings", meetings);
                        constants.updateConfig("meeting_counter", globalID);

                    } else {
                        message.react("👎");
                        message.reply("Ay/Gün ve Saat:Dakika yanlış girildiği için toplantı oluşturulamadı.");
                    }
                } else {
                    message.react("👎");
                    message.reply("Bu komutu yanlış kullandığın için toplantı oluşturulamadı.");
                }
            } else {
                message.react("⛔");
                message.reply("Maalesef toplantı oluşturma yetkisine sahip değilsin. Bu izne sahip olan birinden toplantı oluşturmasını iste.");
            }

        } else if(argv[1] === "remove") {
            let id = argv[2];
            for(let i = 0; i < meetings.length; i++) {
                if(meetings[i].id == id) {
                    const name = meetings[i].topic;
                    meetings.splice(i, 1);
                    meetings.sort(constants.global.byDate);
                    message.reply("Meeting '" + name + "' is removed!");
                    break;
                }
            }
            constants.updateConfig("meetings", meetings);
            let embed = constants.global.generateMeetingsEmbed(meetings);
            message.react("👌");
            message.channel.send(embed);
        }
    }
}

function botatesMeetingInitialize(_client, constants) {
    config = constants.config;
    client = _client;
    updateConfig = constants.updateConfig;
    _constants = constants;
}

module.exports = {
    names: ["meeting", "m"],
    description: "Botates belirtilen tarih ve saate belirli bir konuda toplantı ayarlar ve katılımcıların zamanında toplantıya katılması için onları sunucuda pingler",
    usage: "meeting add <konu> <tarih> <saat>\nmeeting remove <id>",
    execute: botatesMeeting,
    initialize: botatesMeetingInitialize
};