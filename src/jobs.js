//New definitions:
export function harvest(creep, task, tasks) {
  task = task || { job: "harvest", target: creep.room.find(FIND_SOURCES_ACTIVE)[0] };
  tasks = tasks || [];
  if (task.job != "harvest") {
    tasks.push(task);
    tasks.push({ job: "complain", message: "last job (" + task.job + ") dispatched to 'harvest' handler"});
    return tasks;
  }
  var source = Game.getObjectById(task.target);
  const res = creep.harvest(source);
  if (res == OK) {
    if (creep.carry.energy < creep.carryCapacity - creep.getActiveBodyparts(WORK)*2) {
      tasks.push(task); //repeat until full.
    }
  } else if (res == ERR_NOT_IN_RANGE) {

    tasks.push(task); //resume after moving.
    creep.moveTo(source);
  } else {
    //do not resume if failure happened. Let others decide what I should do.
    tasks.push({ job: "complain", message: "last job (" + task.job + ") failed with " + res });
  }

  return tasks;
}

export function complain(creep, task, tasks) {
  task = task || { job: "complain", message: "I am feeling under the weather" };
  tasks = tasks || [];
  console.log("COMPLAINT:", task.message);
  creep.say(task.message);
  return tasks;
}

export function store(creep, task, tasks) {
  task = task || { job: "store", resource: RESOURCE_ENERGY };
  tasks = tasks || [];
  if (task.target) {
    const res = creep.transfer(task.target, task.resource, task.amount);
    if (res == ERR_NOT_IN_RANGE) {
      tasks.push(task); //resume after moving
      creep.moveTo(task.target);
    }
  } else {
    creep.drop(task.resource, task.amount);
  }
  return tasks;
}


//Old definitions:
/*
   var {loadBalancer} = require('utilities');

   function extracting(creep, job_order){
// console.log(Game.rooms[creep.room.name])
if(creep.memory.target_source == undefined){
creep.memory.target_source = loadBalancer(creep)
}
if(creep.carry.energy < creep.carryCapacity) {
var sources = creep.room.find(FIND_SOURCES);
if(creep.harvest(sources[creep.memory.target_source]) == ERR_NOT_IN_RANGE) {
creep.moveTo(sources[creep.memory.target_source]);
}
if(creep.harvest(sources[creep.memory.target_source]) == ERR_NOT_ENOUGH_RESOURCES) {
loadBalancer(creep, 1)
}
}else{
job_finished(creep, job_order)
}
}

function suplying(creep, job_order){
var targets = creep.room.find(FIND_STRUCTURES, {
filter: (structure) => {
return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
structure.energy < structure.energyCapacity;
}
});

// console.log(targets[0])
var containers = creep.room.find(FIND_STRUCTURES, {
filter: (structure) => {
return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < structure.storeCapacity;
}});
var target = creep.pos.findClosestByRange(targets)
var container = creep.pos.findClosestByRange(containers)

if(!target && !container){
job_finished(creep, job_order);
return;
}

if(!target){
target = container
}
switch(creep.transfer(target, RESOURCE_ENERGY)){
  case ERR_NOT_IN_RANGE:
    creep.moveTo(target);
    break;
  case ERR_FULL:
    job_finished(creep, job_order)
    break;
  case ERR_NOT_ENOUGH_RESOURCES:
    if(creep.memory.role != 'logistics'){
    creep.memory.target_source = loadBalancer(creep, 2)
    }
    job_finished(creep, job_order, 'exhausted');
    break;
    }
    }

    function suplying_towers(creep, job_order){
    var targets = creep.room.find(FIND_STRUCTURES, {
filter: (structure) => {
return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
}
});
var target = targets[0];
if(target){
switch(creep.transfer(target, RESOURCE_ENERGY)){
  case ERR_NOT_IN_RANGE:
    creep.moveTo(target);
    break;
  case ERR_FULL:
    job_finished(creep, job_order)
  break;
case ERR_NOT_ENOUGH_RESOURCES:
  job_finished(creep, job_order, 'exhausted');
  break;
  }
}else{
  job_finished(creep, job_order)
}

}

function building(creep, job_order){
  var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
  var target = 0;
  if(targets.length){
    switch(creep.build(targets[target])){
      case ERR_NOT_IN_RANGE:
        creep.moveTo(targets[target]);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        if(creep.memory.role == 'builder'){
          creep.memory.target_source = loadBalancer(creep, 1);
        }else{
          creep.memory.target_source = loadBalancer(creep, 2);
        }
        job_finished(creep, job_order, 'exhausted');
        break;
    }
  }else{
    job_finished(creep, job_order);
  }
}

function repairing(creep, job_order){
  var targets = creep.room.find(FIND_STRUCTURES, {
filter: object => object.hits < object.hitsMax
});
targets.sort(function(a,b){
    return (a.hits/a.hitsMax - b.hits/b.hitsMax)
    })
if(targets.length){
  if(creep.memory.picket_target){
    var target = Game.getObjectById(creep.memory.picket_target);
    if(target.hits == target.hitsMax){
      creep.memory.picket_target = undefined;
    }
    switch(creep.repair(target)){
      case ERR_NOT_IN_RANGE:
        creep.moveTo(target);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        creep.memory.picket_target = undefined;
        var closest_source = creep.pos.findClosestByRange(FIND_SOURCES);
        creep.memory.target_source = creep.room.find(FIND_SOURCES).indexOf(closest_source);
        job_finished(creep, job_order, 'exhausted');
        break;
    }
  }else{
    var idx = 0;
    if(targets.length > 5){
      idx = Math.floor(Math.floor(Math.random() * 5))
    }
    creep.memory.picket_target = targets[idx].id;
  }

}else{
  job_finished(creep, job_order);
}
}

function upgrading(creep, job_order){
  if(creep.carry.energy == 0) {
    job_finished(creep, job_order, 'exhausted');
  }
  if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller);
  }
}

function janitoring(creep, job_order){
  var targets = creep.room.find(FIND_DROPPED_RESOURCES);
  if(targets.length && creep.carry.energy != creep.carryCapacity) {
    creep.moveTo(targets[0]);
    creep.pickup(targets[0]);
  }else{
    job_finished(creep, job_order);
  }
}

function logistics(creep, job_order){
  var containers = creep.room.find(FIND_STRUCTURES, {
filter: (structure) => {
return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0;
}});
var container = creep.pos.findClosestByRange(containers)

  if(!container){
    job_finished(creep, job_order);
    return;
  }
switch(container.transfer(creep, RESOURCE_ENERGY)){
  case ERR_NOT_IN_RANGE:
    creep.moveTo(container);
    break;
  case ERR_FULL:
    job_finished(creep, job_order)
      break;
    case ERR_NOT_ENOUGH_RESOURCES:
      job_finished(creep, job_order)
        break;

}

}

function renewing(creep){
  var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
  if(spawn.renewCreep(creep) == ERR_NOT_IN_RANGE){
    creep.moveTo(spawn);
  }
  if(spawn.renewCreep(creep) == ERR_FULL){
    creep.memory.state = '';
  }
  if(spawn.renewCreep(creep) == ERR_NOT_ENOUGH_ENERGY){
    creep.memory.state = '';
  }
}

function idle(creep, job_order){
  if(!creep.memory.idle){
    creep.memory.idle = 1;
  }
  if(creep.memory.idle % 10){
    job_finished(creep, job_order)
      return
  }
  creep.memory.idle++;
}

function nextState(current_state, job_order){
  var idx = job_order.indexOf(current_state);
  if (idx == -1){
    console.log('error in nextState() of jobs.js')
  }
  if(idx == job_order.length-1){
    return job_order[0];
  }
  return job_order[idx + 1];
}

function job_finished(creep, job_order, condition){
  creep.memory.target_source = loadBalancer(creep, 2)
    if(!creep.memory.mark_for_renewal){
      switch(condition){
        case 'exhausted':
          if(creep.memory.role == 'logistics'){
            creep.memory.state = nextState(creep.memory.state, job_order);
          }else{
            creep.memory.state = job_order[0];
          }
          break;
        default:
          creep.memory.state = nextState(creep.memory.state, job_order);
      }
    }else{
      // console.log(creep)
      creep.memory.mark_for_renewal = '';
      creep.memory.state = 'renewing'
    }
}

module.exports = {
  extracting,
  suplying,
  building,
  repairing,
  upgrading,
  renewing,
  janitoring,
  logistics,
  idle,
  suplying_towers,
};
*/
