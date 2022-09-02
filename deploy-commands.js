const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.js');

const commands = [
	new SlashCommandBuilder().setName('give').setDescription('유저가 지갑 연동 후 커맨드 입력시 리워드 지급'),
	new SlashCommandBuilder().setName('rewardinfo').setDescription('유저가 지갑 연동 후 커맨드 입력시 리워드 보유량 확인'),
	new SlashCommandBuilder().setName('rewardrankinglist').setDescription('랜덤으로 지급받은 AWD의 랭킹 정보 조회'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);