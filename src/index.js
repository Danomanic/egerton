const { Client, Intents } = require('discord.js');
const CronJob = require('cron').CronJob;
const config = require('./config');
const { deployCommands } = require('./deploy-commands');
const { executeCommands } = require('./execute-commands');
const { match } = require('./tasks/match');
const pjson = require('../package.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.login(config.TOKEN);

const job = new CronJob('* * * * *', function() {
	match(client);
}, null, true, 'Europe/London');

client.once('ready', async () => {
	deployCommands();
	console.log('Ready!');
	client.user.setActivity(`Hide the Oddball (${pjson.version})`);
	job.start();
});
executeCommands(client);
