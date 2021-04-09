const { Client, Message, MessageEmbed } = require("discord.js");

const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function generateMeetingsEmbed(meetings) {
    let meetingsEmbed = new MessageEmbed({
        color: 0xff0000,
        title: "Toplantılar",
    });

    meetings.forEach((meeting) => {
        const date = new Date(meeting.date);
        meetingsEmbed
        .addField(meeting.topic + " #" + meeting.id, date.getDate() + " " + months[date.getMonth()] + " " + days[date.getDay()] + "\n" + date.getHours() + " : " + date.getMinutes());
    });

    return meetingsEmbed;
}

function byDate(a, b) {
    var dateA = (new Date(a.date)).getTime(); 
    var dateB = (new Date(b.date)).getTime(); 
    return dateA > dateB ? 1 : -1;  
}

function hasRole(message, eligibleRoles) {
    let isEligible = eligibleRoles.some((role) => {
        return message.member.roles.cache.find(r => r.name === role);
    });
    
    return isEligible;
}

module.exports = {
    generateMeetingsEmbed: generateMeetingsEmbed,
    byDate: byDate,
    hasRole: hasRole
}