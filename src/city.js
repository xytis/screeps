export class City {
    static plan(room) {
        const memory = room.memory;
        memory.zones = memory.zones || {};

        //Scout the map for zones
        const sources = room.find(FIND_SOURCES);
        _.each(sources, (s) => {
            console.log("Source:", s);

        });
    }

    static pick_occupation(room, creep) {
        const memory = room.memory;
        const zones = Object.keys(memory.zones).sort((a,b) => { return memory.zones[a].priority > memory.zones[b].priority });
        _.each(zones, (zone) => {
            //Figure out what new creeps you want
            //Add more creeps if that is required.
            //Or even -- order a spawn from Spawns in this room

            //creep.memory.zone = zone
            //creep.memory.role = ???
        });
    }

    static balance(room, creeps) {
        const memory = room.memory;
        if (!memory.zones || memory.zones.outdated) {
            City.plan(room)
        }
        City.plan(room)
        _.each(creeps, (creep) => {
            if (!creep.memory.zone) {
                City.pick_occupation(room, creep);
            }
        });
    }
}
