/// <reference path='../../../typings/index.d.ts'/>

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./main/containers/App";
import {
    ws,
    pizzaStore,
    scheduler
} from "./home";

// initialize
ws.init("localhost:9000/socket", pizzaStore);
scheduler.startCalcThroughput();

ReactDOM.render(
    <App />,
    document.getElementById("content")
);
