import * as _ from "lodash";
import {ReduceStore} from "flux/utils";
import dispatcher from "../dispatcher/pizzaDispatcher";
import {Chef, Pizza, PizzaStatus, IState} from "../models/pizza";
import * as pizzaAction from "../actions/pizzaActions";

class PizzaStore extends ReduceStore<IState, any> {
    constructor(dispatcher) {
        super(dispatcher);
    }

    getInitialState(): IState {
        return {
            pizzaStatuses: [
                <PizzaStatus>{
                    type: "PiPizza",
                    isOrdered: false,
                    preSum: 0,
                    sum: 0,
                    throughput: 0
                },
                <PizzaStatus>{
                    type: "FactorialPizza",
                    isOrdered: false,
                    preSum: 0,
                    sum: 0,
                    throughput: 0
                },
                <PizzaStatus>{
                    type: "TakeuchiPizza",
                    isOrdered: false,
                    preSum: 0,
                    sum: 0,
                    throughput: 0
                }
            ],
            chefs: []
        };
    }

    reduce(state: IState = this.getInitialState(), action): IState {
        switch (action.type) {
            case pizzaAction.UPDATE_CHEF: {
                // whether the chef already exists
                if (state.chefs.some(chef => chef.address === action.payload.address)) {
                    return <IState>{
                        pizzaStatuses: state.pizzaStatuses,
                        chefs: state.chefs.map(chef =>
                            chef.address === action.payload.address
                                ? _.assign(<Chef>{}, chef, action.payload)
                                : chef)
                    };
                } else {
                    return <IState>{
                        pizzaStatuses: state.pizzaStatuses,
                        chefs: [...state.chefs, <Chef>action.payload]
                    };
                }
            }
            case pizzaAction.SEND_ORDER: {
                return <IState>{
                    chefs: state.chefs,
                    pizzaStatuses: state.pizzaStatuses.map(pizzaStatus =>
                        pizzaStatus.type === action.payload.type
                            ? _.assign(<PizzaStatus>{}, pizzaStatus, {isOrdered: true})
                            : pizzaStatus)
                };
            }
            case pizzaAction.STOP_ORDER: {
                return <IState>{
                    chefs: state.chefs,
                    pizzaStatuses: state.pizzaStatuses.map(pizzaStatus =>
                        pizzaStatus.type === action.payload.type
                            ? _.assign(<PizzaStatus>{}, pizzaStatus, {isOrdered: false})
                            : pizzaStatus)
                };
            }
            case pizzaAction.CLEAR_ALL: {
                return this.getInitialState();
            }
            case pizzaAction.PIZZA_BAKED: {
                return <IState>{
                    chefs: state.chefs,
                    pizzaStatuses: state.pizzaStatuses.map(pizzaStatus =>
                        pizzaStatus.type === action.payload.type &&
                        pizzaStatus.isOrdered === true
                            ? _.assign(<PizzaStatus>{}, pizzaStatus, {sum: pizzaStatus.sum + 1})
                            : pizzaStatus)
                };
            }
            case pizzaAction.CALC_THROUGHPUT: {
                return <IState>{
                    chefs: state.chefs,
                    pizzaStatuses: state.pizzaStatuses.map(pizzaStatus =>
                        pizzaStatus.isOrdered === true
                            ? _.assign(<PizzaStatus>{}, pizzaStatus, {
                            preSum: pizzaStatus.sum,
                            throughput: pizzaStatus.sum - pizzaStatus.preSum
                        })
                            : pizzaStatus)
                };
            }
            default:
                return state;
        }
    }
}

const pizzaStore = new PizzaStore(dispatcher);
export default pizzaStore;