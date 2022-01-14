const { MessageEmbed } = require('discord.js');
const config = require('../config');
const Halo = require('../lib/halo');
const { teamResultsTable } = require('./elements/match-table');
const { getOutcomeColour } = require('../helpers/formatter');
const { getGamerTagStats, getAllGuildies } = require('../helpers/guildies');
const db = require('monk')(config.DB_URI);
const axios = require('axios');

const players = db.get('players');
const matches = db.get('matches');

const sendMatchEmbed = async (matchData, channel, gamerTag) => {
	const gamerTagStats = await getGamerTagStats(gamerTag, matchData.players);
	const allGuildies = await getAllGuildies(matchData.players);
	const embedBuilder = new MessageEmbed()
		.setColor(getOutcomeColour(gamerTagStats.outcome))
		.setTitle(`${gamerTagStats.gamertag} played a match!`)
		.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
		.setDescription(`${matchData.details.map.name} ${matchData.details.category.name}`)
		.addField('Result', gamerTagStats.outcome.toUpperCase(), true)
		.addField('Map', `${matchData.details.map.name} (${matchData.details.playlist.name})`, true)
		.addField('Guildies', allGuildies, true)
		.addField('Gametype', matchData.details.category.name, true)
		.addField('Duration', matchData.duration.human)
		.addField('Teams', teamResultsTable(matchData.teams.details), false)
		.setImage(`${config.CLOUDFRONT_DOMAIN}/match/${matchData.id}.png`)
		.setURL('https://tracker.gg/halo-infinite/match/' + matchData.id)
		.addField('Tracker.gg Link', 'https://tracker.gg/halo-infinite/match/' + matchData.id)
		.setTimestamp(new Date(matchData.played_at));

	channel.send({ embeds: [embedBuilder] });
};

const generatePlayerTableImage = async (matchId) => {
	return await axios.get(`${config.EGERTON_IMAGES_API}/generate/match/${matchId}`);
};

const match = async (channel) => {
	console.log('\n----------------------------\nChecking for new matches...');

	const playersToCheck = await players.find({ });
	for (const player of playersToCheck) {
		try {
			console.log(`\tChecking ${player.gamerTag}...`);
			const lastMatch = await Halo.getLastMatch(player.gamerTag);
			if (!await matches.findOne({ matchId: lastMatch.id })) {
				console.log(`\t\tUpdating ${lastMatch.id} for ${player.gamerTag}...`);
				await matches.insert({ gamertag: player.gamerTag, matchId: lastMatch.id, timestamp: new Date() });
				const matchData = await Halo.getMatchData(lastMatch.id);
				await generatePlayerTableImage(lastMatch.id);
				await sendMatchEmbed(matchData, channel, player.gamerTag);
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	console.log('Done checking...\n----------------------------');
};

module.exports = { match };
