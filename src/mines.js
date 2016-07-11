

function plan_mines(room){
  var spawn = Game.spawns[Object.keys(Game.spawns)[0]];
  spawn.memory.mines = []

  var sources = room.find(FIND_SOURCES);
  for(var kk = 0; kk < sources.length; kk++){
    var source = sources[kk];
    var area = room.lookAtArea(source.pos.y-1,source.pos.x-1,source.pos.y+1,source.pos.x+1,true);

    var empty_squares = area.filter(function(ob){
      return ob.type == 'terrain' && ob.terrain != 'wall'
    })
    spawn.memory.mines.push({id: source.id, max_allowed: empty_squares.length < 3 ? empty_squares.length : 3})

    var candidates_for_container = [];
    for(var ii =0; ii<empty_squares.length; ii++){
      var temp = room.lookAtArea(empty_squares[ii].y-1, empty_squares[ii].x-1, empty_squares[ii].y+1, empty_squares[ii].x+1,true);
      var filtered = temp.filter(function(ob){
        return ob.type == 'terrain' && ob.terrain != 'wall'
      })
      for(var jj=0;jj<filtered.length;jj++){
        var m_pos = {x: filtered[jj].x, y: filtered[jj].y}
        if(!obj_in_array(candidates_for_container, m_pos)){
          candidates_for_container.push(m_pos)
        }
      }
    }
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

function fitness_for_container(candidate_pos, mining_positions){
  var val = 0;
  for(var ii = 0; ii<mining_positions.length; ii++){
    if(candidate_pos.x == mining_positions[ii].x && mining_positions[ii].y == mining_positions[ii].y){
      return 9999;
    }else{
      val += (candidate_pos.x - mining_positions[ii].x) * (candidate_pos.x - mining_positions[ii].x) + (candidate_pos.y - mining_positions[ii].y) * (candidate_pos.y - mining_positions[ii].y)
    }
  }
  return val;
}

function obj_in_array(arr, obj){
  for(var ii = 0; ii < arr.length; ii++){
    if(obj.x == arr[ii].x && obj.y == arr[ii].y){
      return true;
    }
  }
  return false;
}
