function guarding(creep, job_order){
  if(creep.memory.mark_for_renewal){
    job_finished(creep, job_order);
    return;
  }
  if(!creep.memory.invading){
    var target = creep.pos.findClosestByRange(FIND_FLAGS);
    if(target) {
      if(creep.memory.going_to_guard == 10){
        creep.memory.going_to_guard = 0;
        job_finished(creep, job_order)
        return;
      }
      creep.moveTo(target);
      var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(enemy){
        job_finished(creep, job_order)
      }
    }else{
      job_finished(creep, job_order)
    }
  }else{
    var spawn0 = Game.spawns[Object.keys(Game.spawns)[0]];
    going_home(creep, job_order, spawn0.memory.target_room);
  }

}

function seeking(creep, job_order){

  var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  var spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
  if(enemy || spawn) {
    if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
      creep.moveTo(enemy);
    }
    if(!enemy){
      if(creep.attack(spawn) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }
    }
  }else{
    job_finished(creep, job_order)
  }
}

function healing(creep, job_order){

  var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
        return object.hits < object.hitsMax;
    }
  });
  if(target) {
    if(creep.heal(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
  }else{
    job_finished(creep, job_order)
  }
}

function invading(creep, job_order, target_room){
  var exitDir = creep.room.findExitTo(target_room);
  // console.log(exitDir)
  if(exitDir == -10){
    // creep.move(BOTTOM)
    if(creep.memory.role == 'warrior'){
      creep.memory.state = 'seeking'
    }
    if(creep.memory.role == 'healer'){
      creep.memory.state = 'healing'
    }
  }else{
    var exit = creep.pos.findClosestByRange(exitDir);
    var mes = creep.moveTo(exit)
  }

}

function going_home(creep, job_order){
  var home_name = 'E48N18';
   var exitDir = creep.room.findExitTo(home_name);
   if(exitDir == -10){
     if(creep.memory.transited){
       if(creep.move(TOP) == OK){
         creep.memory.invading = false;
         creep.memory.transited = false
       }
     }
     creep.memory.transited = true
   }else{
     var exit = creep.pos.findClosestByRange(exitDir);
     var mes = creep.moveTo(exit)
   }
}

function job_finished(creep, job_order, condition){
  if(!creep.memory.mark_for_renewal){
    switch(condition){
      case 'exhausted':
        creep.memory.state = job_order[0];
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


module.exports = {
    guarding,
    seeking,
    healing,
    invading,
};
