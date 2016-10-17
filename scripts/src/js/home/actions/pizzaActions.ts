import {Chef, Pizza} from "../models/pizza";
import {SocketReqMessage, SocketResMessage} from "../models/messages";
import ws from "../utils/webSocketListener";
import dispatcher from "../dispatcher/pizzaDispatcher";

export const UPDATE_CHEF = "UPDATE_CHEF";
export const SEND_ORDER = "SEND_ORDER";
export const STOP_ORDER = "STOP_ORDER";
export const CLEAR_ALL = "CLEAR_ALL";
export const PIZZA_BAKED = "PIZZA_BAKED";
export const CALC_THROUGHPUT = "CALC_THROUGHPUT";

export const updateChef = (chef: Chef) => {
    dispatcher.dispatch({
        type: UPDATE_CHEF,
        payload: chef
    });
};

export const sendOrder = (pizza: Pizza) => {
    ws.sendReqMessage("orderPizza", pizza, 0);
    dispatcher.dispatch({
        type: SEND_ORDER,
        payload: pizza
    });
};

export const stopOrder = (pizza: Pizza) => {
    ws.sendReqMessage("orderStop", pizza, 0);
    dispatcher.dispatch({
        type: STOP_ORDER,
        payload: pizza
    });
};

export const clearAll = () => {
    // TODO: Call WebSocket send here
    dispatcher.dispatch({
        type: CLEAR_ALL
    });
};

export const pizzaBaked = (pizza: Pizza) => {
    dispatcher.dispatch({
        type: PIZZA_BAKED,
        payload: pizza
    });
}

export const calcThroughput = () => {
    dispatcher.dispatch({
        type: CALC_THROUGHPUT
    });
};
