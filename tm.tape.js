

var configuration = {
	states: {
		'q0': {
			connections: {
				'0': {
					write: '1',
					move: 'l',
					newState: 'q1'
				},
				'1': {
					write: '0',
					move: 'r',
					newState: 'q0'
				}
			},
			accepted: true
		}
	},
	startState: 'q0'
};