const config = require('../config');
const { getCSRDifference } = require('../helpers/formatter');
const db = require('monk')(config.DB_URI);

const playersDb = db.get('players');

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
		if (await playersDb.findOne({ gamerTag: player.gamertag.toLowerCase() })) {
			guildies += `${player.gamertag} __${player.progression.csr.post_match.tier} ${player.progression.csr.post_match.sub_tier + 1}__ *${player.progression.csr.post_match.value}* [**${getCSRDifference(player.progression.csr.pre_match.value, player.progression.csr.post_match.value)}**]\n`;
		}
	}
	return guildies.trim();
};

module.exports = { getGamerTagStats, getAllGuildies };