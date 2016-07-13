/**
 * This file should perform jobs by role string stored in creep memory.
 *
 * Based on the string it should execute function from role.<id>.js file.
 */

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
        // console.log('role: ' + role);
        role.run(creep);
    }
}
