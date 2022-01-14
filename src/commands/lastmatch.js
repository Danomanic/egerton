const config = require('../config');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Halo = require('../lib/halo');
const axios = require('axios');

module.exports = {
	name: 'lastmatch',
	data: new SlashCommandBuilder()
		.setName('lastmatch')
		.setDescription('Get info on a Gamer Tags last match.')
		.addStringOption(option => option.setName('gamertag').setDescription('The Players Xbox Gamertag').setRequired(true)),
	permissions: [],
	async execute(interaction) {
		const gamertag = await interaction.options.getString('gamertag');
		await interaction.reply({ content: `Fetching last match results for ${gamertag}... (this can take a few seconds).`, ephemeral: true });
		try {
			const lastMatch = await Halo.getLastMatch(gamertag);
			await axios.get(`${config.EGERTON_IMAGES_API}/generate/match/${lastMatch.id}`);

			const embedBuilder = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${gamertag}'s Last Match Data`)
				.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
				.setDescription(`Here are the stats for ${gamertag}'s last match`)
				.setImage(`${config.CLOUDFRONT_DOMAIN}/match/${lastMatch.id}.png`);
			await interaction.followUp({ embeds: [embedBuilder] });

		}
		catch (err) {
			await interaction.followUp({ conent: 'Gamertag does not have a last RANKED match. Is the Gamertag correct?', ephemeral: true });
		}
	},
};
