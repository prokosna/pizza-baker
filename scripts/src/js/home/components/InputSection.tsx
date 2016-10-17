import * as React from "react";
import * as _ from "lodash";

import {Pizza, PizzaStatus} from "../models/pizza";

interface InputSectionProps {
    pizzaStatuses: PizzaStatus[];
    sendOrder: (pizza: Pizza) => any;
    stopOrder: (pizza: Pizza) => any;
    clearAll: () => any;
}

class InputSection extends React.Component<InputSectionProps, void> {
    private handleSendOrder(type: string) {
        console.log("sendOrder: " + type);
        this.props.sendOrder({type})
    };

    private handleStopOrder(type: string) {
        console.log("stopOrder: " + type);
        this.props.stopOrder({type})
    };

    private handleClearAll() {
        console.log("clear all");
        console.log(this.props.pizzaStatuses)
        this.props.clearAll();
    };

    render() {
        const {pizzaStatuses} = this.props;
        const piPizzaFlag: boolean = _.find(pizzaStatuses, ps => {
            return ps.type === "PiPizza"
        }).isOrdered;
        return (
            <div>
                <button onClick={this.handleSendOrder.bind(this, "PiPizza")}
                        disabled={piPizzaFlag}>Order Pizza
                </button>
                <button onClick={this.handleStopOrder.bind(this, "PiPizza")}
                        disabled={!piPizzaFlag}>Stop Order
                </button>
            </div>
        );
    }
}

export default InputSection;