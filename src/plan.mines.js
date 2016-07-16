import {fitness_for_container} from 'plan.utilities'

/*
  const memory = room.memory;
  if(!memory.mines_are_set){
    plan_mines(room);
  }

  //something like that will be saved in memory after the exsecution
  memory.zones = [
    {target: blablablabla, name: mine_AS12CD_1, max_allowed: 3},
    .........
  ]
  memory.mines_are_set = true
*/

function plan_mines(room){
  const memory = room.memory;
  var spawn = Game.spawns[Object.keys(Game.spawns)[0]];
  memory.zones = memory.zones || [];
  console.log('Spawn position: ' + spawn.pos)

  var sources = room.find(FIND_SOURCES);
  for(var kk = 0; kk < sources.length; kk++){
    var source = sources[kk];


    var area = room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
    var empty_squares = area.filter(function(ob){
      return ob.type == 'terrain' && ob.terrain != 'wall';
    })
    var larger_area = room.lookAtArea(source.pos.y - 2, source.pos.x - 2, source.pos.y + 2, source.pos.x + 2, true);
    var candidates_for_container = larger_area.filter(function(ob){
      return ob.type == 'terrain' && ob.terrain != 'wall';
    })
    var max_allowed = empty_squares.length < 3 ? empty_squares.length : 3;


    //try to find place for collector for now just place holder
    var target = candidates_for_container[0];
    var val = fitness_for_container(candidates_for_container[0], empty_squares, max_allowed, spawn.pos)
    for(var ii = 0; ii<candidates_for_container.length; ii++){
      if(fitness_for_container(candidates_for_container[ii], empty_squares, max_allowed, spawn.pos) < val){
        target = candidates_for_container[ii];
        val = fitness_for_container(candidates_for_container[ii], empty_squares, max_allowed, spawn.pos)
      }
    }

    room.createConstructionSite(target.x, target.y, STRUCTURE_CONTAINER);
    // push new object into zones
    var container_pos = room.getPositionAt(target.x, target.y)
    memory.zones['mine_' + room.name +'_' + kk] = {type: 'mine', target: source.id, name: 'mine_' + room.name +'_' + kk, priority: 1, container_pos, max_allowed}
  }
  memory.mines_are_set = true;
}

function post_plan_mines(room, zone){
  var found = room.lookForAt(LOOK_CONSTRUCTION_SITES, zone.container_pos.x, zone.container_pos.y)
  zone['container_id'] = room.lookForAt(LOOK_CONSTRUCTION_SITES, zone.container_pos.x, zone.container_pos.y)[0].id;
}

module.exports = {
    plan_mines,
    post_plan_mines,
};
