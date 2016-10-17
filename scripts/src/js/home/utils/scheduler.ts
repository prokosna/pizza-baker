import * as pizzaAction from "../actions/pizzaActions";

class Scheduler {
    startCalcThroughput(){
        this["idCalcThroughput"] = setInterval(this.calcThroughput, 1000);
    }

    stopScheduler(){
        clearInterval(this["idCalcThroughput"]);
    }

    private calcThroughput(){
        pizzaAction.calcThroughput();
    }
}

const instance = new Scheduler();
export default instance;