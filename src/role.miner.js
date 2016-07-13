import * as jobs from "./jobs";

export function run(creep) {
  const zone = creep.memory.zone_name;
  if (!creep.room.memory.zones[zone]) {
    creep.say("I am lost!");
    return;
  }

  const data = creep.room.memory.zones[zone];
  const source = Game.getObjectById(data.target);
  const container = Game.getObjectById(data.container);

  const state = creep.memory.state || [{ job: "harvest", target: source }];

  if (state.length == 0) {
    state.push({ job: "store",    resource: source.mineralType || RESOURCE_ENERGY, target: container });
    state.push({ job: "harvest",  target: source})
  }

  const task = state.pop();
  const job = jobs[task.job];
  if (!job) {
    console.log("JOB NOT FOUND:", task.job);
    creep.say("I may not perform my duty, I can't find my code");
    return;
  }
  creep.memory.state = job(creep, task, state);
}
