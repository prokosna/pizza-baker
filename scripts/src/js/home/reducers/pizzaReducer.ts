// import {assign} from "lodash";
// import {Chef, Pizza, PizzaStatus, IState} from "../models/pizza";
// import * as action from "../actions/pizzaActions";
//
// const initialState: IState = {
//     pizzaStatuses: {
//         piPizza: <PizzaStatus>{
//             type: "PiPizza",
//             isOrdered: false,
//             preSum: 0,
//             sum: 0,
//             throughput: 0
//         },
//         factorialPizza: <PizzaStatus>{
//             type: "FactorialPizza",
//             isOrdered: false,
//             preSum: 0,
//             sum: 0,
//             throughput: 0
//         },
//         takeuchiPizza: <PizzaStatus>{
//             type: "TakeuchiPizza",
//             isOrdered: false,
//             preSum: 0,
//             sum: 0,
//             throughput: 0
//         }
//     },
//     chefs: []
// };
//
// export default function pizzaReducer(state: IState = initialState, action): IState {
//     switch (action.type) {
//         case action.UPDATE_CHEF:
//             // whether the chef already exists
//             if (state.chefs.some(chef => chef.address !== action.payload.address)) {
//                 return <IState>{
//                     pizzaStatuses: state.pizzaStatuses,
//                     chefs: [...state.chefs, <Chef>action.payload]
//                 };
//             } else {
//                 return <IState>{
//                     pizzaStatuses: state.pizzaStatuses,
//                     chefs: state.chefs.map(chef =>
//                         chef.address === action.payload.address
//                             ? assign(<Chef>{}, chef, action.payload)
//                             : chef)
//                 };
//             }
//         case action.SEND_ORDER: {
//             console.log("send order reduce ok");
//             const target = assign(<PizzaStatus>{}, state.pizzaStatuses[action.payload.type], {isOrdered: true});
//             return <IState>{
//                 chefs: state.chefs,
//                 pizzaStatuses: assign(<PizzaStatus>{},
//                     state.pizzaStatuses,
//                     {[action.payload.type]: target})
//             };
//         }
//         case action.STOP_ORDER: {
//             console.log("stop order reduce ok");
//             const target = assign(<PizzaStatus>{}, state.pizzaStatuses[action.payload.type], {isOrdered: false});
//             return <IState>{
//                 chefs: state.chefs,
//                 pizzaStatuses: assign(<PizzaStatus>{},
//                     state.pizzaStatuses,
//                     {[action.payload.type]: target})
//             };
//         }
//         case action.CLEAR_ALL:
//             return initialState;
//         case action.CALC_THROUGHPUT:
//             return <IState>{
//                 chefs: state.chefs,
//                 pizzaStatuses: state.pizzaStatuses
//             };
//         default:
//             return state
//     }
// };
//
// // export default handleActions({
// //     [ADD_TODO]: (state: IState, action: Action<Todo>): IState => {
// //         return [{
// //             completed: action.payload.completed,
// //             id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
// //             text: action.payload.text,
// //         }, ...state];
// //     }
// // }, initialState);
