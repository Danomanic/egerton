const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config');
const db = require('monk')(config.DB_URI);

const players = db.get('players');

module.exports = {
	name: 'removegamertag',
	data: new SlashCommandBuilder()
		.setName('removegamertag')
		.setDescription('Remove a GamerTag from the Database.')
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
		const gamerTag = await interaction.options.getString('gamertag').toLowerCase();
		await interaction.reply({ content: `Removing ${gamerTag} from the Database...`, ephemeral: true });
		try {
			if (await players.findOne({ gamerTag })) {
				await players.remove({ gamerTag });
				await interaction.followUp({ content: `${gamerTag} removed from the Database.`, ephemeral: true });
			}
			else {
				await interaction.followUp({ content: `${gamerTag} is not in the Database. So I can't remove it.`, ephemeral: true });
			}
		}
		catch (err) {
			await interaction.followUp({ content: 'Something went wrong while tring to remove the GamerTag. Please try again later.', ephemeral: true });
		}
	},
};
