const { EmbedBuilder  } = require('discord.js');
const { ROLE_ID, CH_VERIFY} = require('./config.js');
const EMOJI = "✅";

async function ready(client) {
    const ch = await client.channels.fetch(CH_VERIFY);

    const embed = new EmbedBuilder() //
        .setTitle("여기를 눌러 지갑을 연동 하기")
        .setDescription(`위에 문구를 눌러서 지갑을 연동하세요`)
        .setURL(
            "https://discord.com/api/oauth2/authorize?client_id=1014445709401018410&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=identify"
        );
        ch.send({ embeds: [embed] }).then((msg) => {
        msg.react(EMOJI);
    });
}


async function reaction(reaction, user) {
    if (reaction.emoji.name == EMOJI) {
        console.log("messageReactionAdd ok", EMOJI);
        const guild = reaction.message.guild;
        const role = guild.roles.cache.get(ROLE_ID);
        const member = guild.members.cache.get(user.id);
        await member.roles.add(role);
    } else {
        console.log("messageReactionAdd unknown emoji");
    }
}


module.exports = {
    channel_id: CH_VERIFY,
    ready,
    reaction,
};