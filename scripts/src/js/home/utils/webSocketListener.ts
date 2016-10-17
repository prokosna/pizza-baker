import * as pizzaAction from "../actions/pizzaActions";
import {SocketReqMessage, SocketResMessage} from "../models/messages";
import {Chef, Pizza} from "../models/pizza";

class WebSocketListener {
    private _ws: WebSocket;
    private _store: {};

    init(endpoint: string, store) {
        this._store = store;
        const scheme = "ws";
        const url = `${scheme}://${endpoint}`;
        this._ws = new WebSocket(url);
        this._ws.onmessage = this.handleMessage.bind(this);
        this._ws.onclose = this.handleClose.bind(this);
        console.log("ws is connected");
    }

    handleMessage(evt: MessageEvent) {
        console.log("evt: " + evt.data);
        const msg = JSON.parse(evt.data);
        console.log("handleMessage: " + msg);
        switch (msg["type"]) {
            case "request":
                const req = <SocketReqMessage>msg;
                this.handleReq(req);
                break;
            case "response":
                const res = <SocketResMessage>msg;
                this.handleRes(res);
                break;
            default:
                break;
        }
    }

    private handleReq(req: SocketReqMessage){
        console.log("handleReq: " + req.toString());
        switch(req.method){
            case "nodeStateUpdated":
                console.log("nodeStateUpdated: " + JSON.stringify(req.params));
                const chef = <Chef>req.params;
                pizzaAction.updateChef(chef);
                break;
            case "pizzaBaked":
                pizzaAction.pizzaBaked(<Pizza>{ type: req.params });
                break;
        }
    }

    private handleRes(res: SocketResMessage){

    }

    sendReqMessage(method: string, params?: any, id?: number) {
        const req = <SocketReqMessage>{
            type: "request",
            method: method,
            params: params,
            id: id
        };
        this.send(req);
    }

    sendResMessage(method: string, error?: any, result?: any, id?: number){
        const res = <SocketResMessage>{
            type: "response",
            method: method,
            error: error,
            result: result,
            id: id
        };
        this.send(res);
    }

    private send(msg: Object){
        if(!this._ws){
            return;
        }
        const strMsg = JSON.stringify(msg);
        this._ws.send(strMsg);
    }

    handleClose() {
        console.error("lost ws connection");

        // TODO: reconnect action
    }
}

const ws = new WebSocketListener();
export default ws;