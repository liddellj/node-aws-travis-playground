import { RouteHandler } from 'react-router';
import React from 'react';

export default class App extends React.Component {
    render() {
        return <div>
            <h1>Hello Jim's App Handler Version 4.1.0</h1>
            <RouteHandler />
        </div>;
    }
}