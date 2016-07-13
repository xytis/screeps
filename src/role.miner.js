import * as jobs from "./jobs";

export function run(creep) {

  const zone_name = creep.memory.zone_name;
  if (!creep.room.memory.zones[zone_name]) {
    creep.say("I am lost!");
    return;
  }

  const zone = creep.room.memory.zones[zone_name];
  const source = Game.getObjectById(zone.target);
  const container = Game.getObjectById(zone.container);

  const state = creep.memory.state || [{ job: "harvest", target: zone.target }];


  if (state.length == 0) {
    state.push({ job: "store",    resource: source.mineralType || RESOURCE_ENERGY, target: container });
    state.push({ job: "harvest",  target: zone.target})
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
