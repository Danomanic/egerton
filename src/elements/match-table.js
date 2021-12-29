const AsciiTable = require('ascii-table');

const playerResultsTable = (results, teamId) => {
	const table = new AsciiTable();
	table.setHeading('', 'S', 'K', 'D', 'A', 'Dmg', 'CSR');
	results.forEach((playerDetails) => {
		if (playerDetails.team.id === teamId) {
			table.setTitle(playerDetails.team.name);
			table.addRow(
				`${trimString(playerDetails.gamertag, 10)}`,
				playerDetails.stats.core.score,
				`${playerDetails.stats.core.summary.kills}`,
				`${playerDetails.stats.core.summary.deaths}`,
				`${playerDetails.stats.core.summary.assists}`,
				`${playerDetails.stats.core.damage.dealt}`,
				`${playerDetails.progression.csr.post_match.value} [${getCSRDifference(playerDetails.progression.csr.pre_match.value, playerDetails.progression.csr.post_match.value)}]`,
			);
		}
	});
	table.sortColumn(1, function(a, b) {
		return b - a;
	});
	table.removeBorder();
	return '```\n{output}\n```'.replace('{output}', table.toString());
};

const teamResultsTable = (results) => {
	const table = new AsciiTable();
	table.setHeading('', '', 'S', 'K', 'D', 'A');
	results.forEach((teamDetails) => {
		table.addRow(
			teamDetails.team.name,
			teamDetails.outcome,
			teamDetails.stats.core.score,
			teamDetails.stats.core.summary.kills,
			teamDetails.stats.core.summary.deaths,
			teamDetails.stats.core.summary.assists,
		);
	});
	table.removeBorder();
	return '```\n{output}\n```'.replace('{output}', table.toString());
};

const trimString = (string, length) => string.length > length ? string.substring(0, length - 3) + '.' : string;

const getCSRDifference = (before, after) => {
	const difference = after - before;

	return (difference <= 0 ? '' : '+') + difference;
};

module.exports = { playerResultsTable, teamResultsTable };