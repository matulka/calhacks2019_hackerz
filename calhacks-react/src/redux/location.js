import * as ActionTypes from './ActionTypes';

export const Location = (state = {
		id: ''
	}, action) => {
	switch(action.type) {

		case ActionTypes.LOCATION_ID:
			return {...state, id: action.payload};

		default: 
			return state;
	}
}