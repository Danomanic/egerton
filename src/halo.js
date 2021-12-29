const lib = require('lib')({ token: config.STDLIB_SECRET_TOKEN });

const HaloAPI = lib.halo.infinite['@0.3.3'];


// / Test CODEEEE

const getLastMatch = async () => {
	const result = await HaloAPI.stats.matches.list({
		gamertag: 'danoidx',
		limit: {
			count: 1,
			offset: 0,
		},
		mode: 'matchmade',
	});
	return result.data[0].id;
};

const getMatchData = async (matchId) => {
	const result = await HaloAPI.stats.matches.retrieve({
		id: matchId,
	});

	return result.data;
};

const main = async () => {
	const lastMatch = await getLastMatch();
	const matchData = await getMatchData(lastMatch);
	// console.log(matchData);
};
