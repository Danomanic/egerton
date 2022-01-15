const config = require('../config');
const Halo = require('../lib/halo');
const db = require('monk')(config.DB_URI);
const axios = require('axios');
const { getMatchEmbed } = require('../elements/match-embed');

const players = db.get('players');
const matches = db.get('matches');

const generatePlayerTableImage = async (matchId) => {
	return axios.get(`${config.EGERTON_IMAGES_API}/generate/match/${matchId}`);
};

const match = async (client) => {
	console.log('\n----------------------------\nChecking for new matches...');

	const playersToCheck = await players.find({ });
	for (const player of playersToCheck) {
		try {
			const channel = await client.channels.cache.get(player.channelId);
			console.log(`\tChecking ${player.gamerTag}...`);
			const lastMatch = await Halo.getLastMatch(player.gamerTag);
			if (!await matches.findOne({ matchId: lastMatch.id })) {
				console.log(`\t\tUpdating ${lastMatch.id} for ${player.gamerTag}...`);
				await matches.insert({ gamertag: player.gamerTag, matchId: lastMatch.id, timestamp: new Date() });
				const matchData = await Halo.getMatchData(lastMatch.id);
				await generatePlayerTableImage(lastMatch.id);
				const embed = await getMatchEmbed(matchData, player.gamerTag);
				channel.send({ embeds: [embed] });
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	console.log('Done checking...\n----------------------------');
};

module.exports = { match };
