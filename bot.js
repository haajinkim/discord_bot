const { token } = require("./config.js");
const { Client, GatewayIntentBits } = require('discord.js');
const Verify =  require("./bot-verify.js");
const { channel_id } = require("./bot-verify.js");
const client = new Client({
	intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions
    ],
});
const GUILD_ID = "1014420094681616445";
const ROLE_ID = "1014744335188762684";
const MEMBER_ID = "1014445709401018410"
const CHANNEL_ID = "1014420095138807830";

client.once("ready", async () => {
    console.log(`Ready!`);
    const guild = client.guilds.cache.get(GUILD_ID);
    const channel = guild.channels.cache.get(CHANNEL_ID);
    console.log("channel", channel);
    const role = guild.roles.cache.get(ROLE_ID);
    const member = await guild.members.fetch(MEMBER_ID);
    console.log("member", member);
    member.roles.add(role);
    //   member.roles.remove(role);
    channel.send("bot start");

    const ch_verify = guild.channels.cache.get(channel_id);
    const old_msg = await ch_verify.messages.fetch();
    ch_verify.bulkDelete(old_msg);

    Verify.ready(client)
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (!reaction.message.guild) return;

    if (reaction.message.channelId == Verify.channel_id) {
        Verify.reaction(reaction, user);
    } else {
        console.error("messageReactionAdd no ch");
    }
});


client.on("messageCreate", async (message) => {
    //
    if (message.author.bot) return;
    console.log("msg_content",message.content);

    if (message.content == "a") {
        message.reply("b");
    } else {
        console.log("message.content", message.content);
    }
});

client.login(token);
console.log('login');

async function add_nft_role(user_id) {
    console.log("add_nft_role", user_id);
    const guild = client.guilds.cache.get(GUILD_ID);
    const role = guild.roles.cache.get(ROLE_ID);
    const member = await guild.members.fetch(user_id);
    member.roles.add(role);
}

module.exports = {
    add_nft_role
}