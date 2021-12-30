const config = require('../config');   
const lib = require('lib')({ token: config.STDLIB_SECRET_TOKEN });
const HaloAPI = lib.halo.infinite['@0.3.3'];

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

module.exports = { getLastMatch, getMatchData };