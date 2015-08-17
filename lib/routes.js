"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactRouter = require("react-router");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsApp = require("./components/App");

var _componentsApp2 = _interopRequireDefault(_componentsApp);

var _componentsHome = require("./components/Home");

var _componentsHome2 = _interopRequireDefault(_componentsHome);

var _componentsAbout = require("./components/About");

var _componentsAbout2 = _interopRequireDefault(_componentsAbout);

exports["default"] = _react2["default"].createElement(
	_reactRouter.Route,
	{ handler: _componentsApp2["default"] },
	_react2["default"].createElement(_reactRouter.Route, { path: "/", handler: _componentsHome2["default"] }),
	_react2["default"].createElement(_reactRouter.Route, { handler: _componentsAbout2["default"], path: "about" })
);
module.exports = exports["default"];