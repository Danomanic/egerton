const config = require('../config');
const { MessageEmbed } = require('discord.js');
const { teamResultsTable } = require('./match-table');
const { getOutcomeColour } = require('../helpers/formatter');
const { getGamerTagStats, getAllGuildies } = require('../helpers/guildies');

const getMatchEmbed = async (matchData, gamerTag) => {
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
		.addField('Duration', matchData.duration.human, true)
		.addField('Teams', teamResultsTable(matchData.teams.details), false)
		.setImage(`${config.CLOUDFRONT_DOMAIN}/match/${matchData.id}.png`)
		.setURL('https://tracker.gg/halo-infinite/match/' + matchData.id)
		.addField('Tracker.gg Link', 'https://tracker.gg/halo-infinite/match/' + matchData.id)
		.setTimestamp(new Date(matchData.played_at));

	return embedBuilder;
};

module.exports = { getMatchEmbed };