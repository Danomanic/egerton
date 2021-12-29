const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const CronJob = require('cron').CronJob;
const config = require('./config');
const { deployCommands } = require('./deploy-commands');
const { match } = require('./halo/match');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const job = new CronJob('* * * * *', function() {
	match(client.channels.cache.get(config.CHANNEL_ID));
}, null, true, 'Europe/London');

client.once('ready', async () => {
	deployCommands();
	console.log('Ready!');
	client.user.setActivity('Hide the Oddball');
	job.start();
});

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
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(config.TOKEN);