const AsciiTable = require('ascii-table');

const teamResultsTable = (results) => {
	const table = new AsciiTable();
	table.setHeading('', '', 'S', 'K', 'D', 'A');
	results.forEach((teamDetails) => {
		table.addRow(
			teamDetails.team.name,
			teamDetails.outcome,
			teamDetails.stats.core.points,
			teamDetails.stats.core.summary.kills,
			teamDetails.stats.core.summary.deaths,
			teamDetails.stats.core.summary.assists,
		);
	});
	table.removeBorder();
	return '```\n{output}\n```'.replace('{output}', table.toString());
};

module.exports = { teamResultsTable };