/// <reference path='../../../typings/index.d.ts'/>
"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var App_1 = require("./main/containers/App");
var rootReducer_1 = require("./main/rootReducer");
var initialState = {};
var store = redux_1.createStore(rootReducer_1.default, initialState);
ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, React.createElement(App_1.default, null)), document.getElementById("content"));
//# sourceMappingURL=main.js.map