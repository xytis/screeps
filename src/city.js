import { plan_mines, post_plan_mines } from './plan.mines'

export class City {
  static plan(room) {
    const memory = room.memory;
    memory.post_planed = false;
    memory.zones = memory.zones || {};
    memory.zones_ttl = 300;
    memory.colony_state = 'just_born';
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
    if (creeps.length < 6) {
      let spawn = room.find(FIND_MY_SPAWNS)[0];
      spawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'miner'});
    }else{
      memory.colony_state = 'young';
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
