const config = require('../config');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const uuid = require('uuid');
const axios = require('axios');

module.exports = {
	name: 'stats',
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Replies with your Halo Infinite stats.')
		.addStringOption(option => option.setName('gamertag').setDescription('The Players Xbox Gamertag')),
	permissions: [],
	async execute(interaction) {
		const gamertag = await interaction.options.getString('gamertag');
		await interaction.reply({ content: `Fetching stats for ${gamertag}... (this can take a few seconds).`, ephemeral: true });
		try {
			const genUuid = uuid.v1();
			const repsonse = await axios.get(`${config.EGERTON_IMAGES_API}/generate/gamertag/${gamertag}/${genUuid}`);
			if (repsonse.status === 200) {
				const embedBuilder = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`${gamertag}'s Stats`)
					.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
					.setDescription(`Here are the stats for ${gamertag}`)
					.setImage(`${config.CLOUDFRONT_DOMAIN}/gamertag/${genUuid}.png`);
				await interaction.followUp({ embeds: [embedBuilder] });
			}
			else {
				await interaction.followUp('Gamertag does not exist. Is the Gamertag correct?');
			}
		}
		catch (err) {
			console.log(err);
			await interaction.followUp('Something went wrong, please try again later.');
		}
	},
};
