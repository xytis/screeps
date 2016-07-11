
const ROLES = {
    'builder': require('./role.builder'),
    'harvester': require('./role.harvester'),
    'healer': require('./role.healer'),
};

export class Roles {
    static perform(creep) {
        if (!creep.memory.role) {
            console.log("creep", creep.name, "has no role!");
            return ERR_INVALID_ARGS;
        }
        const role = ROLES[creep.memory.role];
        if (!role) {
            console.log("creep", creep.name, "role", creep.memory.role, "is not supported!");
            return ERR_INVALID_ARGS;
        }
        role.run(creep);
    }
}
