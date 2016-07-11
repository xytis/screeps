var {extracting, building, repairing, janitoring} = require('jobs')

var roleRepairer = {

    job_order: ['extracting', 'janitoring' , 'repairing', 'building'],
    run: function(creep) {
      switch(creep.memory.state){
        case 'extracting':
          extracting(creep, this.job_order)
          break;
        case 'repairing':
          repairing(creep, this.job_order)
          break;
        case 'building':
          building(creep, this.job_order)
          break;
        case 'janitoring':
          janitoring(creep, this.job_order)
          break;
        default:
          creep.memory.state = 'extracting'
          break;
      }

	}
};

module.exports = {
    roleRepairer
};
