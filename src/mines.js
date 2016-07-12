
function plan_mines(room){
  var spawn = Game.spawns[Object.keys(Game.spawns)[0]];
  spawn.memory.mines = []

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
    spawn.memory.mines.push({id: source.id, max_allowed: empty_squares.length < 3 ? empty_squares.length : 3})

    //try to find place for collector for now just place holder
    var target = candidates_for_container[0];
    var val = fitness_for_container(candidates_for_container[0], empty_squares)
    for(var ii = 0; ii<candidates_for_container.length; ii++){
      if(fitness_for_container(candidates_for_container[ii], empty_squares) < val){
        target = candidates_for_container[ii];
        val = fitness_for_container(candidates_for_container[ii], empty_squares)
      }
    }

    room.createConstructionSite(target.x, target.y, STRUCTURE_CONTAINER);
  }
}

function fitness_for_container(candidate_pos, mining_positions, max_allowed){
  var val = [];
  for(var ii = 0; ii<mining_positions.length; ii++){
    //naive way of calculatign cost. TODO: use pathfinding instead
    var dx = candidate_pos.x - mining_positions[ii].x;
    var dy = candidate_pos.y - mining_positions[ii].y;
    val.push(Math.sqrt(dx * dx + dy*dy))
  }
  var cost = val.sort().slice(0, max_allowed).reduce(function(a, b){return a+b}, 0)
  return cost;
}
