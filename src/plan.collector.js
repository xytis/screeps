import {fitness_for_container} from 'plan.utilities'

/*
  //something like that will be saved in memory after the exsecution
  memory.zones = [
    {target: controller_id, name, max_allowed, container_pos, container_id},
    .........
  ]
*/

function plan_controller(room){
  const memory = room.memory;
  memory.zones = memory.zones || [];
  var spawn = Game.spawns[Object.keys(Game.spawns)[0]];
  const controller = room.controller

  var area = room.lookAtArea(controller.pos.y - 1, controller.pos.x - 1, controller.pos.y + 1, controller.pos.x + 1, true);
  var empty_squares = area.filter(function(ob){
    return ob.type == 'terrain' && ob.terrain != 'wall';
  })
  var larger_area = room.lookAtArea(controller.pos.y - 2, controller.pos.x - 2, controller.pos.y + 2, controller.pos.x + 2, true);
  var candidates_for_container = larger_area.filter(function(ob){
    return ob.type == 'terrain' && ob.terrain != 'wall';
  })

  var max_allowed = empty_squares.length < 3 ? empty_squares.length : 3;

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
  memory.zones['controller' + room.name] = {type: 'controller', target: controller.id, name: 'controller_' + room.name, priority: 10, container_pos, max_allowed}

  memory.controller_is_set = true;
}

function post_plan_controller(room, zone){
  var found = room.lookForAt(LOOK_CONSTRUCTION_SITES, zone.container_pos.x, zone.container_pos.y)
  zone['container_id'] = room.lookForAt(LOOK_CONSTRUCTION_SITES, zone.container_pos.x, zone.container_pos.y)[0].id;
}

module.exports = {
    plan_controller,
    post_plan_controller,
};
