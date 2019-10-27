import * as ActionTypes from './ActionTypes';
const baseUrl = 'http://localhost:3001/';

export const fetchLogin = (username, keyword) => (dispatch) => {

    return fetch(baseUrl + 'login/' + username + '/' + keyword)
        .then(response => {
            if (response.ok){
				return response;
			}
			else {
				var error = new Error('Error '+ response.status +': '+response.statusText);
				error.response = response;
				throw error;
			}
		},
		error => {
			var errmess = new Error(error.message);
			throw errmess;
		})
		.then(response => response.json())
		.then(location => dispatch(locationId(location)));
}

export const locationId= (location) => ({
    type: ActionTypes.LOCATION_ID,
    payload: location
})