

var configuration = {
	states: {
		'q0': {
			connections: {
				'0': {
					write: '1',
					move: 'L',
					newState: 'q1'
				},
				'1': {
					write: '0',
					move: 'R',
					newState: 'q0'
				}
			},
			accepted: true
		}
	},
	startState: 'q0'
};