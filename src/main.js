import { Scheduler } from './scheduler';

const scheduler = new Scheduler();

export function loop () {
    scheduler.tick()
    console.log("ES6 is working");
}
