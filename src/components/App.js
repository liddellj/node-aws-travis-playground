import { RouteHandler } from 'react-router';
import React from 'react';

export default class App extends React.Component {
  render() {
    return <div>
      <h1>Hello Jim's App Handler Version {process.env.npm_package_version} ({process.env.ENV_LABEL})</h1>
        <RouteHandler />
        <small>Some feature</small>
        <br />
        <small>Some tweak</small>
        <br />
        <small>Some other tweak</small>
        
      </div>;
  }
}