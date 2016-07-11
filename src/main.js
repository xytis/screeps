import { Scheduler } from './scheduler';
import { City } from './city';

const scheduler = new Scheduler();

const city = new City();

export function loop () {
    scheduler.tick()
    console.log("ES6 is working");
}
