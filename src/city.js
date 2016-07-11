export class City {
    constructor() {
    
    }

    plan(room) {
        //Scout the map for zones
        const resources = room.find(FIND_SOURCES);
        for (let r in resources) {
            console.log("Resource", r.pos);
        }
    }
}
