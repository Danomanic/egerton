const getCSRDifference = (before, after) => {
	const difference = after - before;

	return (difference <= 0 ? '' : '+') + difference;
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

module.exports = { getCSRDifference, getOutcomeColour };