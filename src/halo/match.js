const { MessageEmbed } = require('discord.js');
const config = require('../config');
const Halo = require('../lib/halo');
const { teamResultsTable } = require('./elements/match-table');
const { getOutcomeColour } = require('../helpers/formatter');
const { getGamerTagStats, getAllGuildies } = require('../helpers/guildies');
const db = require('monk')(config.DB_URI);
const axios = require('axios');

const matches = db.get('matches');

const sendMatchEmbed = async (matchData, channel, gamerTag) => {
	const gamerTagStats = await getGamerTagStats(gamerTag, matchData.players);
	const allGuildies = await getAllGuildies(matchData.players);
	const embedBuilder = new MessageEmbed()
		.setColor(getOutcomeColour(gamerTagStats.outcome))
		.setTitle('A member of our Team has played a match!')
		.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
		.setDescription('A member of the Halo Team has played a match, here are the results!')
		.addFields(
			{ name: 'Result', value: `${gamerTagStats.outcome.toUpperCase()}`, inline: true },
			{ name: 'Guildies', value: `${allGuildies}`, inline: true },
			{ name: 'Map', value: `${matchData.details.map.name} (${matchData.details.playlist.name})`, inline: true },
			{ name: 'Gametype', value: matchData.details.category.name, inline: true },
			{ name: 'Duration', value: matchData.duration.human, inline: true },
			{ name: 'Teams', value: teamResultsTable(matchData.teams.details) },
		)
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
	console.log('\n----------------------------\nChecking for new matches...\n----------------------------\n');

	for (const gamerTag of config.GAMER_TAGS) {
		const lastMatch = await Halo.getLastMatch(gamerTag);
		const matchCount = await matches.count({ matchId: lastMatch.id });
		console.log(`Checking ${gamerTag}...`);
		if (matchCount === 0) {
			console.log(`+ Updating ${lastMatch.id} for ${gamerTag}...`);
			await matches.insert({ gamertag: gamerTag, matchId: lastMatch.id, timestamp: new Date() });
			const matchData = await Halo.getMatchData(lastMatch.id);
			await generatePlayerTableImage(lastMatch.id);
			await sendMatchEmbed(matchData, channel, gamerTag);
		}
	}
};

module.exports = { match };
