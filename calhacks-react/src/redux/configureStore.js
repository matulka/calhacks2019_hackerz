import { createForms } from 'react-redux-form';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { registration, accomodation, login } from './forms';
import { Location } from './location';

export const ConfigureStore = () => {
	const store = createStore(
		combineReducers({
			location: Location,
			...createForms({
                register: registration,
                accomodate: accomodation,
                login: login
            })
		}),
		applyMiddleware(thunk, logger)
	);

	return store;
}