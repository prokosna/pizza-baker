export type Chef = {
    address: string;
    roles: string[];
    status: string;
};

export type Pizza = {
    type: string;
};

export type PizzaStatus = {
    type: string;
    isOrdered: boolean;
    preSum: number;
    sum: number;
    throughput: number;
};

export type IState = {
    pizzaStatuses: PizzaStatus[];
    chefs: Chef[];
};
