"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_redux_1 = require("react-redux");
var React = require("react");
var home_1 = require("../../home");
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        var _a = this.props, todos = _a.todos, dispatch = _a.dispatch;
        return (React.createElement("div", {className: "todoApp"}, React.createElement(home_1.MainSection, {addTodo: function (text) { return dispatch(home_1.addTodo(text)); }})));
    };
    return App;
}(React.Component));
var mapStateToProps = function (state) { return ({
    todos: state.todos
}); };
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(App);
//# sourceMappingURL=App.js.map