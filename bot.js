const { token } = require("./config.js");
const { Client, GatewayIntentBits } = require('discord.js');
const Verify =  require("./bot-verify.js");
const { channel_id } = require("./bot-verify.js");
const Sequelize = require('sequelize');
const { GUILD_ID, CHANNEL_ID, ROLE_ID, MEMBER_ID  } = require('./config.js');
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const client = new Client({
	intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions
    ],
});


const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});


const user = sequelize.define('user', {
    username: {
		type: Sequelize.STRING,
		unique: true,
	},
	user_id: {
		type: Sequelize.STRING,
		unique: true,
	},
    wallet_addr: {
        type: Sequelize.STRING,
		unique: true,
    },
	reward: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});


client.once("ready", async () => {
    const guild = client.guilds.cache.get(GUILD_ID);
    const channel = guild.channels.cache.get(CHANNEL_ID);
    const role = guild.roles.cache.get(ROLE_ID);
    const member = await guild.members.fetch(MEMBER_ID);

    member.roles.add(role);

    channel.send("bot start");

    const ch_verify = guild.channels.cache.get(channel_id);
    const old_msg = await ch_verify.messages.fetch();

    ch_verify.bulkDelete(old_msg);
    user.sync();
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

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on('interactionCreate', async interaction => {
    const cur_user = await user.findOne({ where: { user_id: interaction.user.id } });

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'give') {
        if (cur_user.reward === null ){
            rnadom_reward = rand(100, 1000)
            cur_user.update({
                reward: rnadom_reward
            })
            await interaction.reply(`
            <@${interaction.user.id}>에게 초기정착금 ${rnadom_reward}을 보냈습니다.
            <@${interaction.user.id}>가 현재 보유한 금액은 ${rnadom_reward} 입니다  
            `)
        }
        else {
            await interaction.reply("이미 초기 리워드를 보유하고 계십니다.")
            
        }

    }

    else if (interaction.commandName === 'rewardinfo') 
        {
        await interaction.reply(`<@${interaction.user.id}>의 리워드는 ${cur_user.reward} 입니다`)
        }

    else if (interaction.commandName === 'rewardrankinglist') {
        const user_list = await user.findAll({ attributes: ["username", "reward"] });
        arr = []
        rank_list = []
        for (let i = 0; i < user_list.length; i++) {
            arr.push((user_list[i].dataValues))
            arr.sort(function (a, b) {
                if (a.reward > b.reward) return -1;
            })
        }
        for (let i = 0; i < arr.length; i++) {
            rank_list.push(`${i + 1}위:${arr[i].username}`)
        }
        await interaction.reply(`${rank_list}`)
    }

});


client.login(token);

async function add_nft_role(user_id, wallet_addr) {
    const guild = client.guilds.cache.get(GUILD_ID);
    const role = guild.roles.cache.get(ROLE_ID);
    const member = await guild.members.fetch(user_id);
    member.roles.add(role);
    try {
        user.create({
            username: member.user.username,
            wallet_addr: wallet_addr,
            user_id: user_id
        })
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return interaction.reply('That tag already exists.');
        }
        return interaction.reply('Something went wrong with adding a tag.');
    }
}

module.exports = {
    add_nft_role
}