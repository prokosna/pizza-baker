import * as React from "react";
import * as _ from "lodash";

import {Pizza, PizzaStatus} from "../models/pizza";

interface ResultSectionProps {
    pizzaStatuses: PizzaStatus[];
}

class ResultSection extends React.Component<ResultSectionProps, void> {
    render() {
        const {pizzaStatuses} = this.props;
        const pizzaResults = pizzaStatuses.filter(ps => ps.type === "PiPizza").map((ps: PizzaStatus, index: number) => {
            return(
                <div key={index}>
                    <h4>Throughput</h4>
                    <strong>{ps.throughput}</strong> / sec
                    <h4>Total</h4>
                    <strong>{ps.sum}</strong>
                </div>
            );
        });
        return (
            <div>
                <h2>You got Pizza!</h2>
                {pizzaResults}
            </div>
        );
    }
}

export default ResultSection;