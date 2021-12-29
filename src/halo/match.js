const { MessageEmbed } = require('discord.js');
const config = require('../config');
const lib = require('lib')({ token: config.STDLIB_SECRET_TOKEN });
const HaloAPI = lib.halo.infinite['@0.3.3'];
const { playerResultsTable, teamResultsTable } = require('../elements/match-table');
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
		.setTimestamp();

	channel.send({ embeds: [embedBuilder] });
};

const getGamerTagStats = async (gamerTag, players) => {
	return players.find((player) => {
		if (player.gamertag.toLowerCase() === gamerTag.toLowerCase()) {
			return player;
		}
	});
};

const getAllGuildies = async (players) => {
	let guildies = '';
	for (const player of players) {
		config.GAMER_TAGS.find((member) => {
			if (player.gamertag.toLowerCase() === member.toLowerCase()) {
				guildies += `**${player.gamertag}** __${player.progression.csr.post_match.tier}__ *${player.progression.csr.post_match.value}* [${getCSRDifference(player.progression.csr.pre_match.value, player.progression.csr.post_match.value)}]\n`;
			}
		});
	}
	return guildies.trim();
};

const getOutcomeColour = (outcome) => {
	switch (outcome) {
	case 'win':
		return '#00FF00';
	case 'loss':
		return '#ff0000';
	default:
		return '#ffffff';
	}
};

const getLastMatch = async (gamertag) => {
	const result = await HaloAPI.stats.matches.list({
		gamertag: gamertag,
		limit: {
			count: 1,
			offset: 0,
		},
		mode: 'matchmade',
	});
	return result.data[0];
};

const getMatchData = async (matchId) => {
	const result = await HaloAPI.stats.matches.retrieve({
		id: matchId,
	});

	return result.data;
};

const match = async (channel) => {
	console.log('\n----------------------------\nChecking for new matches...\n----------------------------\n');

	for (const gamerTag of config.GAMER_TAGS) {
		const lastMatch = await getLastMatch(gamerTag);
		const matchCount = await matches.count({ matchId: lastMatch.id });
		console.log(`Checking ${gamerTag}...`);
		if (matchCount === 0) {
			console.log(`+ Updating ${lastMatch.id} for ${gamerTag}...`);
			await matches.insert({ gamertag: gamerTag, matchId: lastMatch.id, timestamp: new Date() });
			const matchData = await getMatchData(lastMatch.id);
			await sendMatchEmbed(matchData, channel, gamerTag);
		}
	}
};

const getCSRDifference = (before, after) => {
	const difference = after - before;

	return (difference <= 0 ? '' : '+') + difference;
};

module.exports = { match };
