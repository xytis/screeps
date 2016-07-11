export class Scheduler {
    constructor() {
    
    }

    tick() {
        console.log("scheduler>tick");
        console.log("  cpu limit:", Game.cpu.limit);
        console.log("  cpu max limit:", Game.cpu.tickLimit);
        console.log("  cpu bucket:", Game.cpu.bucket);
        //Plan for some CPU intensive tasks. If the task is ready to be done -- perform it.
    }
}
