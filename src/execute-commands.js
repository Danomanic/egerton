const fs = require('fs');
const { Collection } = require('discord.js');

const executeCommands = (client) => {
	client.commands = new Collection();
	const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.data.name, command);
	}

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			console.log(`Executing command { commandName:${interaction.commandName}, commandId:${interaction.commandId}, guildId:${interaction.guildId}, }`);
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	});
};

module.exports = { executeCommands };