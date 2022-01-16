const config = require('../config');
const { MessageEmbed } = require('discord.js');
const { getOutcomeColour } = require('../helpers/formatter');
const { getGamerTagStats, getAllGuildies } = require('../helpers/guildies');

const getMatchEmbed = async (matchData, gamerTag) => {
	const gamerTagStats = await getGamerTagStats(gamerTag, matchData.players);
	const allGuildies = await getAllGuildies(matchData.players);
	return new MessageEmbed()
		.setColor(getOutcomeColour(gamerTagStats.outcome))
		.setTitle(`${gamerTagStats.gamertag} played a match!`)
		.setAuthor({ name: 'Egerton', iconURL: 'https://i.imgur.com/YEjKMuZ.png' })
		.setDescription(`(${gamerTagStats.outcome.toUpperCase()}) ${matchData.details.map.name} ${matchData.details.category.name}`)
		.addField('Tracked Players', allGuildies, false)
		.addField('Score', `${matchData.teams.details[0].team.name.charAt(0)} ${matchData.teams.details[0].stats.core.points} : ${matchData.teams.details[1].stats.core.points} ${matchData.teams.details[1].team.name.charAt(0)}`, true)
		.addField('Kills', `${matchData.teams.details[0].team.name.charAt(0)} ${matchData.teams.details[0].stats.core.summary.kills} : ${matchData.teams.details[1].stats.core.summary.kills} ${matchData.teams.details[1].team.name.charAt(0)} `, true)
		.addField('Map', `${matchData.details.map.name}`, true)
		.addField('Gametype', matchData.details.category.name, true)
		.addField('Duration', matchData.duration.human, true)
		.addField('Queue', `${matchData.details.playlist.properties.queue.toUpperCase()} ${matchData.details.playlist.properties.input.toUpperCase()}`, true)
		.setImage(`${config.CLOUDFRONT_DOMAIN}/match/${matchData.id}.png`)
		.setURL('https://tracker.gg/halo-infinite/match/' + matchData.id)
		.addField('Tracker.gg Link', 'https://tracker.gg/halo-infinite/match/' + matchData.id)
		.setTimestamp(new Date(matchData.played_at));
};

module.exports = { getMatchEmbed };