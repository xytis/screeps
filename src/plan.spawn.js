/***
 * Expected usage:
 *
 *    const memory = room.memory;
 *    if (!memory.plans.spawn) {
 *       plan_spawn(room);
 *    }
 *
 * After that, memory structure should contain such entries:
 *
 *    memory.plans.spawn = {
 *        stage: 0,
 *        spawn_locations: [ {x,y, state: ('flag' | 'site' | 'building') }, ... ],
 *    }
 *
 *    memory.zones.spawns = [{
 *            slots: {
 *                'carrier-xxx': {},
 *                'builder-xxx': {},
 *                ...
 *            }
 *        }
 *    ]
 */
