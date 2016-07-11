function loadBalancer(creep, priority){
  //speed up harvesting
  // if(creep.memory.role == 'harvester'){
  //   return 1;
  // }
  var max_allowed = Math.floor(0.6 * _.filter(Game.creeps, (creep) => creep.memory.role != 'warrior' && creep.memory.role != 'warrior_large' && creep.memory.role != 'healer').length);
  var sources = creep.room.find(FIND_SOURCES, {
    filter: function(source){
      return source.energy > 0
    }
  });
  var sources_original = sources.slice();
  var cur_harv = []

  for(var ii =0; ii < sources.length; ii++){
    cur_harv[ii] = _.filter(Game.creeps, (creep) => creep.memory.target_source == ii).length;
  }

  sources.sort(function(a, b){
    var val_a = a.energy/(creep.pos.getRangeTo(a) * (cur_harv[sources_original.indexOf(a)] * 10 + 0.01));
    var val_b = b.energy/(creep.pos.getRangeTo(b) * (cur_harv[sources_original.indexOf(b)] * 10 + 0.01));
    return  val_b - val_a;
  })

  for(var ii =0; ii < sources_original.length; ii++){
    var temp = sources[ii];
    if(cur_harv.indexOf(temp) < max_allowed){
      return sources_original.indexOf(sources[ii]);
    }
  }
  return sources_original.indexOf(sources[0]);

}


function showInfo(population){

  var sources = Game.spawns[Object.keys(Game.spawns)[0]].room.find(FIND_SOURCES)

  console.log('\n')
  console.log('==========================================================')
  console.log('INFO')
  console.log('\n')
  console.log('Population')
  for (var key in population){
    var pop = _.filter(Game.creeps, (creep) => creep.memory.role == key);
    console.log(key + '. Active: ' + pop.length + ', Target:' + population[key].amount)
  }

  console.log('\n')
  console.log('Load balansing')
  var cur_harv = []
  for(var ii =0; ii < sources.length; ii++){
    cur_harv[ii] = _.filter(Game.creeps, (creep) => creep.memory.target_source == ii).length;
    console.log(ii + 'th source collected by: ' + cur_harv[ii])
  }
  console.log('\n')
  console.log('Misc')
  console.log('Number of renewing:' + _.filter(Game.creeps, (creep) => creep.memory.state == 'renewing').length)
  console.log('Number of outdated:' + _.filter(Game.creeps, (creep) => creep.memory.outdated).length)
  console.log('==========================================================')
}



function place_extensions(room){
  room.createConstructionSite(44, 22, STRUCTURE_ROAD);
  room.createConstructionSite(45, 22, STRUCTURE_ROAD);
  room.createConstructionSite(46, 22, STRUCTURE_ROAD);
  room.createConstructionSite(46, 25, STRUCTURE_ROAD);
  room.createConstructionSite(46, 23, STRUCTURE_ROAD);
  room.createConstructionSite(46, 24, STRUCTURE_ROAD);

  room.createConstructionSite(42, 21, STRUCTURE_EXTENSION);
  room.createConstructionSite(43, 21, STRUCTURE_EXTENSION);
  room.createConstructionSite(44, 21, STRUCTURE_EXTENSION);
  room.createConstructionSite(45, 21, STRUCTURE_EXTENSION);
  room.createConstructionSite(46, 21, STRUCTURE_EXTENSION);
}


module.exports = {
    loadBalancer,
    showInfo,
    place_extensions,
};
