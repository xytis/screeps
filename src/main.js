//import { Scheduler } from './scheduler';

//import { Colony } from './colony';
import { City } from './city';
import { Roles } from './roles';

//const scheduler = new Scheduler();

export function loop () {
    for(const id in Memory.creeps) {
        if (!Game.creeps[id]) {
            delete Memory.creeps[id];
        }
    }

    //scheduler.tick();
    //Colony.plan();

    for(const id in Game.rooms) {
        const room = Game.rooms[id];
        let creeps = room.find(FIND_MY_CREEPS).map((id) => { return Game.creeps[id]; });
        //Here should go role rebalancing by room
        City.balance(room, creeps);
    }

    for (const id in Game.creeps) {
        const creep = Game.creeps[id];
        //Perform current tick
        const result = Roles.perform(creep);
    }
}
