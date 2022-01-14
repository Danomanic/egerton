const { Client, Intents } = require('discord.js');
const CronJob = require('cron').CronJob;
const config = require('./config');
const { deployCommands } = require('./deploy-commands');
const { executeCommands } = require('./execute-commands');
const { match } = require('./halo/match');
const pjson = require('../package.json');
console.log(pjson.version);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const job = new CronJob('* * * * *', function() {
	match(client.channels.cache.get(config.CHANNEL_ID));
}, null, true, 'Europe/London');

client.once('ready', async () => {
	deployCommands();
	console.log('Ready!');
	client.user.setActivity(`Hide the Oddball (${pjson.version})`);
	job.start();
});
executeCommands(client);

client.login(config.TOKEN);