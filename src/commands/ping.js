const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'ping',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	permissions: [],
	async execute(interaction) {
		console.log('Pong!');
		await interaction.reply('Pongz!');
	},
};
