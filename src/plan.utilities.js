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
    fitness_for_container,
};
