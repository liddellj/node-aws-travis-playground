/*eslint no-unused-vars:0 */

import { Route } from 'react-router';
import React from 'react';
import App from './components/App';
import Home from './components/Home';
import About from './components/About';

export default (
	<Route handler={App}>
		<Route path="/" handler={Home} />
		<Route handler={About} path="about" />
	</Route>
);