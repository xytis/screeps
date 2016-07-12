
const ROLES = {
    'miner': require('./role.miner'),
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
        console.log(role);
        role.run(creep);
    }
}
