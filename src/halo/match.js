const { MessageEmbed } = require('discord.js');
const config = require('../config');
const Halo = require('../lib/halo');
const { playerResultsTable, teamResultsTable } = require('../elements/match-table');
const { getOutcomeColour } = require('../helpers/formatter');
const { getGamerTagStats, getAllGuildies } = require('../helpers/guildies');
const db = require('monk')(config.DB_URI);

const matches = db.get('matches');

const sendMatchEmbed = async (match, channel, gamerTag) => {
	const gamerTagStats = await getGamerTagStats(gamerTag, match.players);
	const allGuildies = await getAllGuildies(match.players);
	const embedBuilder = new MessageEmbed()
		.setColor(getOutcomeColour(gamerTagStats.outcome))
		.setTitle('A member of our Team has played a match!')
		.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
		.setDescription('A member of the Halo Team has played a match, here are the results!')
		.addFields(
			{ name: 'Result', value: `${gamerTagStats.outcome.toUpperCase()}`, inline: true },
			{ name: 'Guildies', value: `${allGuildies}`, inline: true },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Map', value: `${match.details.map.name} (${match.details.playlist.name})`, inline: true },
			{ name: 'Gametype', value: match.details.category.name, inline: true },
			{ name: 'Duration', value: match.duration.human, inline: true },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Teams', value: teamResultsTable(match.teams.details) },
			{ name: '\u200B', value: playerResultsTable(match.players, 0) },
			{ name: '\u200B', value: playerResultsTable(match.players, 1) },
		)
		.setURL('https://tracker.gg/halo-infinite/match/' + match.id)
		.addField('Tracker.gg Link', 'https://tracker.gg/halo-infinite/match/' + match.id)
		.setTimestamp(new Date(match.played_at));

	channel.send({ embeds: [embedBuilder] });
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
			await sendMatchEmbed(matchData, channel, gamerTag);
		}
	}
};

module.exports = { match };
