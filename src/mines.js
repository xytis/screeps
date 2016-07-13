/*
  The way I envisioned this to work in main or city is:

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
  console.log(spawn.pos)

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
    memory.zones['mine_' + room.name +'_' + kk] = {target: source.id, name: 'mine_' + room.name +'_' + kk, priority: 1, max_allowed}

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
  }
  memory.mines_are_set = true;
}

function fitness_for_container(candidate_pos, mining_positions, max_allowed, spawn_pos){
  var val = [];
  //calculate range to spawn cost
  var sx = candidate_pos.x - spawn_pos.x;
  var sy = candidate_pos.y - spawn_pos.y;
  var spawn_cost = Math.sqrt(sx * sx + sy*sy)
  // calculate active pos cost
  for(var ii = 0; ii<mining_positions.length; ii++){
    val.push(findPath(Game.rooms[spawn_pos.roomName]
                        .getPositionAt(candidate_pos.x,candidate_pos.y),
                      Game.rooms[spawn_pos.roomName]
                        .getPositionAt(mining_positions[ii].x,mining_positions[ii].y),
                      mining_positions));

  }
  var cost = val.sort().slice(0, max_allowed).reduce(function(a, b){return a+b}, 0) //sum of max_allowed lowest values
  return cost + spawn_cost/10;
}

function findPath(start_pos, end_pos, mining_pos){
  //include possible positions fo other creeps in cost matrix
  var PFret = PathFinder.search(start_pos,
     {pos: end_pos, range: 1},
     {
       plainCost: 1,
       swampCost: 1,
       roomCallback: function(roomname){
         //no checking if room exists
         let costs = new PathFinder.CostMatrix;
         mining_pos.forEach(function(location){
           costs.set(location.x, location.y, 10);
         })
         return costs;
       }
     }
   );
  return PFret.path.length;
}

module.exports = {
    plan_mines,
};
