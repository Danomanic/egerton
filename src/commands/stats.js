const config = require('../config');
const { Client, Intents, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const uuid = require('uuid');
const axios = require('axios');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Replies with your Halo Infinite stats.')
		.addStringOption(option => option.setName('gamertag').setDescription('The Players Xbox Gamertag')),
	async execute(interaction) {
		await interaction.deferReply();
		const gamertag = await interaction.options.getString('gamertag');
		const genUuid = uuid.v1();
		await axios.get(`${config.EGERTON_IMAGES_API}/generate/gamertag/${gamertag}/${genUuid}`);
		const embedBuilder = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${gamertag}'s Stats`)
			.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
			.setDescription(`Here are the stats for ${gamertag}`)
			.setImage(`${config.CLOUDFRONT_DOMAIN}/gamertag/${genUuid}.png`);
		await interaction.editReply({ embeds: [embedBuilder] });
	},
};
