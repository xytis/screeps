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

    _.each(Game.rooms, (room) => {
        const creeps = room.find(FIND_MY_CREEPS);
        //Here should go role rebalancing by room
        City.balance(room, creeps);
    });

    _.each(Game.creeps, (creep) => {
        const result = Roles.perform(creep);
    });
}
