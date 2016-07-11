var {logistics, idle, suplying, suplying_towers} = require('jobs')

var roleLogistics = {

    job_order: ['logistics', 'suplying', 'logistics2', 'suplying_towers', 'idle'],
    run: function(creep) {
      switch(creep.memory.state){
        case 'logistics':
          logistics(creep, this.job_order)
          break;
        case 'logistics2':
          logistics(creep, this.job_order)
          break;
        case 'idle':
          idle(creep, this.job_order)
          break;
        case 'suplying':
          suplying(creep, this.job_order)
          break;
        case 'suplying_towers':
          suplying_towers(creep, this.job_order)
          break;
        default:
          creep.memory.state = 'logistics'
          break;
      }

	}
};

module.exports = {
    roleLogistics
};
