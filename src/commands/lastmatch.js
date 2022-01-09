const config = require('../config');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Halo = require('../lib/halo');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lastmatch')
		.setDescription('Get info on a Gamer Tags last match.')
		.addStringOption(option => option.setName('gamertag').setDescription('The Players Xbox Gamertag')),
	async execute(interaction) {
		await interaction.deferReply();
		const gamertag = await interaction.options.getString('gamertag');
		const lastMatch = await Halo.getLastMatch(gamertag);
		await axios.get(`${config.EGERTON_IMAGES_API}/generate/match/${lastMatch.id}`);

		const embedBuilder = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${gamertag}'s Last Match Data`)
			.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
			.setDescription(`Here are the stats for ${gamertag}'s last match`)
			.setImage(`${config.CLOUDFRONT_DOMAIN}/match/${lastMatch.id}.png`);
		await interaction.editReply({ embeds: [embedBuilder] });
	},
};
