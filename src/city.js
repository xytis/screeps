export class City {
  static plan(room) {
    const memory = room.memory;
    memory.zones = memory.zones || {};
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
    _.each(room.find(FIND_SOURCES), (s) => {
      console.log('found a source');
      const id = 'mine-' + s.id;
      const zone = memory.zones[id] = memory.zones[id] || {
        slots: {},
      };
      const work_area = _.filter(
        room.lookAtArea(s.pos.y-1, s.pos.x-1, s.pos.y+1, s.pos.x+1, true),
        (e) => {
          return e.type == LOOK_TERRAIN ||
            e.type == LOOK_STRUCTURES ||
            e.type == LOOK_CONSTRUCTION_SITES;
        }
      );
      const empty_area = _.filter(work_area, (e) => {
        return e.type == LOOK_TERRAIN && OBSTACLE_OBJECT_TYPES.indexOf(e.terrain) == -1;
      });
      const max_slots = empty_area.length < 3 ? empty_area.length : 3;
      zone.priority = 10 + max_slots * 5; //Default -- 25 priority.

      zone.slots = zone.slots || {};

      //Check if the zone has a container or a construction site for it,
      //or
      //Find a place for a construction site
      let container = null;
      let best_fitness = 9999;
      let best_pos = null;
      const build_area = room.lookAtArea(s.pos.y-2, s.pos.x-2, s.pos.y+2, s.pos.x+2);
      for (let i in build_area) {
        for (let j in build_area[i]) {
          if (i == s.pos.y-2 || i == s.pos.y+2 || j == s.pos.x-2 || j == s.pos.x+2) {
            for (let k in build_area[i][j]) {
              const e = build_area[i][j][k];
              if (e.type == LOOK_CONSTRUCTION_SITES && e.constructionSite.structureType == STRUCTURE_CONTAINER) {
                container = e.constructionSite;
                break;
              }
              if (e.type == LOOK_STRUCTURES && e.structure.structureType == STRUCTURE_CONTAINER) {
                container = e.structure;
                break;
              }
            }
            let fitness = 0;
            for(let k in empty_area) {
              const p = empty_area[k];
              fitness += (j - p.x)*(j - p.x) + (i - p.y)*(i - p.y);
            }
            if (fitness < best_fitness) {
              best_fitness = fitness;
              best_pos = {x: Number(j), y: Number(i)};
            }
          }
        }
      }
      if (!container) {
        let res = room.createConstructionSite(best_pos.x, best_pos.y, STRUCTURE_CONTAINER);
        if (OK == res) {
          container = room.lookForAt(LOOK_CONSTRUCTION_SITES, best_pos.x, best_pos.y);
        } else {
          container = {
            pos: best_pos,
            id: null,
            falure: res,
          };
        }
      }
      zone.container = container;

      //Define builder slot if required:
      if (container.progress >= 0) {
        zone.slots.builder = {
          role: 'builder',
          target: container.id,
        }
      }
      //Define remaining slots:
      for (let i = 0; i < max_slots; i++) {
        zone.slots['miner-' + (i+1)] = {
          role: 'miner',
          target: s.id,
          container: container.id,
        }
      }

      console.log("Source:", s);
    });
  }

  static spawn(room, creeps) {
    //Find first creep that we could spawn

  }

  static pick_occupation(room, creep) {
    const memory = room.memory;
    const zones = Object.keys(memory.zones).sort((a,b) => { return memory.zones[a].priority > memory.zones[b].priority });
    _.each(zones, (zone) => {
      //Figure out what new creeps you want
      //Add more creeps if that is required.
      //Or even -- order a spawn from Spawns in this room

      //creep.memory.zone = zone
      //creep.memory.role = ???
    });
  }

  static balance(room, creeps) {
    const memory = room.memory;
    //if (!memory.zones || memory.zones.outdated) {
    City.plan(room)
    //}
    City.spawn(room, creeps);

    _.each(creeps, (creep) => {
      if (!creep.memory.zone) {
        City.pick_occupation(room, creep);
      }
    });
  }
}
