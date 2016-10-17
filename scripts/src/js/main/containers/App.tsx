import * as React from "react";
import {Container} from "flux/utils";

import {
    TitleSection,
    InputSection,
    ResultSection,
    ChefsSection,
    pizzaStore,
    sendOrder,
    stopOrder,
    clearAll,
    calcThroughput
} from "../../home";

class App extends React.Component<any, any> {
    static getStores() {
        return [pizzaStore];
    }

    static calculateState(prevState) {
        return {
            data: pizzaStore.getState()
        };
    }

    render() {
        const {chefs, pizzaStatuses} = this.state.data;

        return (
            <div className="pizzaApp">
                <TitleSection/>
                <hr/>
                <ChefsSection chefs={chefs}/>
                <hr/>
                <InputSection sendOrder={sendOrder}
                              stopOrder={stopOrder}
                              clearAll={clearAll}
                              pizzaStatuses={pizzaStatuses}/>
                <hr/>
                <ResultSection pizzaStatuses={pizzaStatuses}/>
            </div>
        );
    }
}

const appContainer = Container.create(App);
export default appContainer;
