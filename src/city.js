import { plan_mines, post_plan_mines } from './plan.mines'

export class City {
  static plan(room) {
    const memory = room.memory;
    memory.post_planed = false;
    memory.zones = memory.zones || {};
    memory.zones_ttl = 300;
    //Scout the map for zones

    memory.zones.spawn = memory.zones.spawn || {
      priority: 10,
      type: 'spawn',
    };
    _.each(room.find(FIND_MY_SPAWNS), (s) => {
      const spawn = memory.zones.spawn;
      spawn.slots = spawn.slots || {};
      spawn.slots['carrier-' + s.id] = {
        role: 'carrier',
        resource: 'energy',
        source: null, //any
        destination: s.id,
      }
    });

    //Determine mine locations and slots

    plan_mines(room);


    // _.each(room.find(FIND_SOURCES), (s) => {
    //   const id = 'mine-' + s.id;
    //   const zone = memory.zones[id] = memory.zones[id] || {
    //     slots: {},
    //   };
    //   const work_area = _.filter(
    //     room.lookAtArea(s.pos.y-1, s.pos.x-1, s.pos.y+1, s.pos.x+1, true),
    //     (e) => {
    //       return e.type == LOOK_TERRAIN ||
    //         e.type == LOOK_STRUCTURES ||
    //         e.type == LOOK_CONSTRUCTION_SITES;
    //     }
    //   );
    //   const empty_area = _.filter(work_area, (e) => {
    //     return e.type == LOOK_TERRAIN && OBSTACLE_OBJECT_TYPES.indexOf(e.terrain) == -1;
    //   });
    //   const max_slots = empty_area.length < 3 ? empty_area.length : 3;
    //   zone.priority = 10 + max_slots * 5; //Default -- 25 priority.
    //
    //   zone.slots = zone.slots || {};
    //
    //   //Check if the zone has a container or a construction site for it,
    //   //or
    //   //Find a place for a construction site
    //   let container = null;
    //   let best_fitness = 9999;
    //   let best_pos = null;
    //   const build_area = room.lookAtArea(s.pos.y-2, s.pos.x-2, s.pos.y+2, s.pos.x+2);
    //   for (let i in build_area) {
    //     for (let j in build_area[i]) {
    //       if (i == s.pos.y-2 || i == s.pos.y+2 || j == s.pos.x-2 || j == s.pos.x+2) {
    //         for (let k in build_area[i][j]) {
    //           const e = build_area[i][j][k];
    //           if (e.type == LOOK_CONSTRUCTION_SITES && e.constructionSite.structureType == STRUCTURE_CONTAINER) {
    //             container = e.constructionSite;
    //             break;
    //           }
    //           if (e.type == LOOK_STRUCTURES && e.structure.structureType == STRUCTURE_CONTAINER) {
    //             container = e.structure;
    //             break;
    //           }
    //         }
    //         let fitness = 0;
    //         for(let k in empty_area) {
    //           const p = empty_area[k];
    //           fitness += (j - p.x)*(j - p.x) + (i - p.y)*(i - p.y);
    //         }
    //         if (fitness < best_fitness) {
    //           best_fitness = fitness;
    //           best_pos = {x: Number(j), y: Number(i)};
    //         }
    //       }
    //     }
    //   }
    //   if (!container) {
    //     let res = room.createConstructionSite(best_pos.x, best_pos.y, STRUCTURE_CONTAINER);
    //     if (OK == res) {
    //       container = room.lookForAt(LOOK_CONSTRUCTION_SITES, best_pos.x, best_pos.y);
    //     } else {
    //       container = {
    //         pos: best_pos,
    //         id: null,
    //         falure: res,
    //       };
    //     }
    //   }
    //   zone.container = container;
    //
    //   //Define builder slot if required:
    //   if (container.progress >= 0) {
    //     zone.slots.builder = {
    //       role: 'builder',
    //       target: container.id,
    //     }
    //   }
    //   //Define remaining slots:
    //   for (let i = 0; i < max_slots; i++) {
    //     zone.slots['miner-' + (i+1)] = {
    //       role: 'miner',
    //       target: s.id,
    //       container: container.id,
    //       share_factor: max_slots,
    //     }
    //   }
    //
    //   console.log("Source:", s);
    // });
  }

  static post_plan(room){
    var zones = room.memory.zones;
    Object.keys(zones).forEach(function(key){
      switch (zones[key].type) {
        case 'mine':
          post_plan_mines(room, zones[key])
          break;
        default:
          console.log('This zone has no post_plan method: ' + zones[key].type)
      }
    })
    room.memory.post_planed = true;
  }

  static spawn(room, creeps) {
    //Find first creep that we could spawn
    if (creeps.length < 1) {
      let spawn = room.find(FIND_MY_SPAWNS)[0];
      spawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'miner' });
    }
  }

  static assign_to_zone(room, creep, zone_name){
    var zone = room.memory.zones[zone_name];
    // this method goes something like this:
    var workers_in_zone = _.filter(Game.creeps, (creep) => creep.memory.zone_name == zone.name);
    if(workers_in_zone.length >= zone.max_allowed){
      creep.say("Zone " + zone.name + " is full");
      return -1;
    }else{
      console.log(creep + ' assigned to zone' + zone.name)
      // creep.say('Assigned to zone ' + zone.name);
      creep.memory.zone_name = zone.name;
      return 0;
    }
  }

  static pick_occupation(room, creep) {
    const memory = room.memory;
    const zones = Object.keys(memory.zones).sort((a,b) => { return memory.zones[a].priority > memory.zones[b].priority });
    for(var ii =0; ii < zones.length; ii++){
      var res = City.assign_to_zone(room, creep, zones[ii])
      if(res == 0){
        return;
      }
    }
    // I couldnt return from inside of each calback
    // _.each(zones, (zone) => {
    //   //Figure out what new creeps you want
    //   //Add more creeps if that is required.
    //   //Or even -- order a spawn from Spawns in this room
    //
    //   //creep.memory.zone = zone
    //   //creep.memory.role = ???
    // });
  }

  static balance(room, creeps) {
    const memory = room.memory;
    if (!memory.zones || memory.zones_ttl <= 0) {
      City.plan(room)
    } else {
      if(!room.memory.post_planed){
        City.post_plan(room)
      }
      // temporaly disabled re-planing.
      // memory.zones_ttl--;
    }

    City.spawn(room, creeps);

    _.each(creeps, (creep) => {
      if (!creep.memory.zone_name) {
        City.pick_occupation(room, creep);
      }
    });
  }
}
