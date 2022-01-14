const { SlashCommandBuilder } = require('@discordjs/builders');
const Halo = require('../lib/halo');
const config = require('../config');
const db = require('monk')(config.DB_URI);

const players = db.get('players');

module.exports = {
	name: 'addgamertag',
	data: new SlashCommandBuilder()
		.setName('addgamertag')
		.setDescription('Add a GamerTag to the database to check for matches.')
		.addStringOption(option => option.setName('gamertag').setDescription('The Players Xbox Gamertag').setRequired(true))
		.setDefaultPermission(false),
	permissions: [
		{
			id: '167598990626390016',
			type: 2,
			permission: true,
		},
	],
	async execute(interaction) {
		const user = await interaction.user;
		const gamerTag = await interaction.options.getString('gamertag').toLowerCase();
		await interaction.reply({ content : `Hello <@${user.id}> - I'm just checking to see if the GamerTag ${gamerTag} exists...`, ephemeral: true });
		try {
			const lastMatch = await Halo.getLastMatch(gamerTag);
			if (lastMatch.id && !await players.findOne({ gamerTag })) {
				await players.insert({ gamerTag, user: user.id, guildId: interaction.guildId, channelId: interaction.channelId });
				await interaction.followUp({ content: `<@${user.id}> GamerTag exists! I've added ${gamerTag} to the Database to check for new matches.`, ephemeral: true });
			}
		}
		catch (err) {
			console.log(err);
			await interaction.editReply(`<@${user.id}> Something went wrong while trying to add the GamerTag. Is the GamerTag correct?`);
		}
	},
};
