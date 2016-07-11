var roleHarvester = require('role.harvester').roleHarvester;
var roleUpgrader = require('role.upgrader').roleUpgrader;
var roleBuilder = require('role.builder').roleBuilder;
var roleRepairer = require('role.repairer').roleRepairer;
var roleLogistics = require('role.logistics').roleLogistics;
var {roleSpawn, population_control} = require('role.spawn');

var roleWarrior = require('role.warrior').roleWarrior;
var roleHealer = require('role.healer').roleHealer;

var {showInfo, place_extensions} = require('utilities');
var {renewing} = require('jobs')

var controlers = {
  harvester: roleHarvester,
  upgrader: roleUpgrader,
  builder: roleBuilder,
  repairer: roleRepairer,
  warrior: roleWarrior,
  healer: roleHealer,
  logistics: roleLogistics,
}

module.exports.loop = function () {
    var spawn0 = Game.spawns[Object.keys(Game.spawns)[0]];
    //trigger invasion

    //building placement
    if(spawn0.room.controller.level == 4){
      place_extensions(spawn0.room)
    }

    //Cleanup
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
          var m = new Date();
          var dateString = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
          delete Memory.creeps[name];
          spawn0.memory.deaths.push('name: ' + name + ' timestamp: ' + dateString )
          console.log('Clearing non-existing creep memory:', name);
        }
    }


    //run creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(spawn0.memory.trigger_invasion && (creep.memory.role == 'warrior' || creep.memory.role == 'healer')){
          creep.memory.invading = true;
        }
        solve_problems(creep);
        //uncoment to prevent small body creeps from renewing
        if(check_renewal_condition(creep)){
          //renewing cycle
          if(creep.memory.state == 'renewing'){
            renewing(creep);
          }else{
            creep.memory.mark_for_renewal = true;
          }
        }else{
          //work cycle
          controlers[roleSpawn.store.population[creep.memory.role].behaviour].run(creep)
        }

    }

    //run spawns
    for(var name_spawn in Game.spawns) {
        var spawn = Game.spawns[name_spawn];
        roleSpawn.run(spawn);
    }



    if(!spawn0.memory.it){
      spawn0.memory.it = 1;
    }else{
      spawn0.memory.it++;
    }
    if(spawn0.memory.it%10 == 0){
      showInfo(roleSpawn.store.population)
    }
}

function solve_problems(creep){
  if(creep.memory.target_source < 0){
    console.log('ERROR: ' + creep + ' had bad target_source value')
    creep.memory.target_source = 0;
  }
}

function check_renewal_condition(creep){
  return !creep.memory.outdated
          && !creep.memory.mark_for_renewal
          && (creep.ticksToLive < 300
            || creep.memory.state == 'renewing')
          && population_control(creep);
}
