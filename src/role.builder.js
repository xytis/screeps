import * as jobs from "./jobs";

export function run(creep) {

  const zone_name = creep.memory.zone_name;
  if (!creep.room.memory.zones[zone_name]) {
    creep.say("I am lost!");
    return;
  }

  const zone = creep.room.memory.zones[zone_name];
  const source = Game.getObjectById(zone.target);

  var stores = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return  [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_SPAWN].indexOf(structure.structureType) !== -1 && structure.store.energy != 0;
        }
      });
  var closest_store = creep.pos.findClosestByRange(stores)

  const state = creep.memory.state || [{ job: "build", target: creep.room.find(FIND_CONSTRUCTION_SITES)[0].id }];


  if (state.length == 0) {
    state.push({ job: "load",    resource: RESOURCE_ENERGY, target: closest_store.id });
    state.push({ job: "build",  target: creep.room.find(FIND_CONSTRUCTION_SITES)[0].id})
  }

  const task = state.pop();
  const job = jobs[task.job];
  if (!job) {
    console.log("JOB NOT FOUND:" + task.job);
    creep.say("I may not perform my duty, I can't find my code");
    return;
  }
  // console.log(state.length)
  creep.memory.state = job(creep, task, state);
}
