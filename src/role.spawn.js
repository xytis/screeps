var {loadBalancer} = require('utilities');

const recipes =  {
        init: [WORK, CARRY, MOVE], //200
        small: [WORK, CARRY, CARRY, MOVE, MOVE], //400
        small_worker: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], //400
        medium: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], //550
        large: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], //800 worker
        warrior: [MOVE, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE], //300
        warrior_large: [TOUGH, TOUGH, TOUGH, MOVE,  MOVE,  MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], //600
        healer: [MOVE, HEAL, MOVE], //350
        logistics: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], //350
      }
var roleSpawn = {
    store: {
      population: {
        harvester: {amount: 0, recipe: recipes.small, behaviour: 'harvester'},
        upgrader: {amount: 1, recipe: recipes.medium, behaviour: 'upgrader'},
        repairer: {amount: 2, recipe: recipes.small_worker, behaviour: 'repairer'},
        builder: {amount: 3, recipe: recipes.medium, behaviour: 'builder'},
        warrior: {amount: 2, recipe: recipes.warrior, behaviour: 'warrior'},
        healer: {amount: 1, recipe: recipes.healer, behaviour: 'healer'},
        logistics: {amount: 1, recipe: recipes.logistics, behaviour: 'logistics'},
        harvester_medium: {amount: 2, recipe: recipes.medium, behaviour: 'harvester'},
        upgrader_large: {amount: 4, recipe: recipes.large, behaviour: 'upgrader'},
        harvester_large: {amount: 5, recipe: recipes.large, behaviour: 'harvester'},
        warrior_large: {amount: 1, recipe: recipes.warrior_large, behaviour: 'warrior'},
      },
      id: 0,
    },

    run: function(spawn){
        var keys = Object.keys(this.store.population)

        for (var key in this.store.population){
          var population = _.filter(Game.creeps, (creep) => creep.memory.role == key);
          if(population.length < this.store.population[key].amount){
              this.spawnCreep(spawn, key, this.store.population[key].recipe)
              break;
          }
        }
    },

    spawnCreep: function(spawn, type, recipe){
      while(true){
        var message = spawn.createCreep( recipe, type + this.store.id, {role: type, state: 'idle'})
        if(message == -3){
          this.store.id++;
        }else{
          break;
        }
      }

      switch(message){
          case -1:
              console.log(message);
              break;
          case -3:
              this.store.id++;
              break;
          case -4:
              // console.log('busy');
              break;
          case -6:
              // console.log('not ebough energy');
              break;
          case -10:
              console.log('invalid arguments in creation');
              break;
          case -14:
              console.log('controler lvl');
              break;
          default:
              console.log('creating '+ type + ': ' + message)
      }
    }

}

function population_control(mcreep){
  var role_tested = mcreep.memory.role
  var population = _.filter(Game.creeps, (creep) => creep.memory.role == role_tested).length;
  // console.log(mcreep + '  target: ' + roleSpawn.store.population[role_tested].amount + '  current: '+ population)
  if(roleSpawn.store.population[role_tested].amount < population || mcreep.body.length != roleSpawn.store.population[role_tested].recipe.length){
    //prevent renewal
    console.log(mcreep + ' marked as outdated')
    mcreep.memory.outdated = true
    return false;
  }else{
    return true;
  }
}

module.exports = {
    roleSpawn,
    population_control,
};
