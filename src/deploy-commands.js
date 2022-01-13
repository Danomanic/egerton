const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');


const deployCommands = () => {
	const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => file.endsWith('.js'));

	const commands = [];
	const permissions = [];
	const rest = new REST({ version: '9' }).setToken(config.TOKEN);
	// eslint-disable-next-line no-restricted-syntax
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
		if (command.permissions != undefined) {
			permissions.push({ name: command.name, permissions: command.permissions });
		}
	}

	rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: commands })
		.then((results) => {
			results.forEach((command) => {
				console.log(`Command added { commandName:${command.name}, commandId:${command.id}, guildId:${config.GUILD_ID}, }`);
				const commandPermissions = permissions.filter((permission) => permission.name === command.name).shift();

				if (commandPermissions.permissions.length > 0) {
					rest.put(Routes.applicationCommandPermissions(config.CLIENT_ID, config.GUILD_ID, command.id), { body: { permissions: commandPermissions.permissions } })
						.then(() => {
							console.log(`Permission added { commandName:${command.name}, commandId:${command.id}, guildId:${config.GUILD_ID}, }`);
						})
						.catch(console.error);
				}

			});
		})
		.catch(console.error);

};

module.exports = { deployCommands };
