var {extracting, building, upgrading} = require('jobs')

var roleBuilder = {
    job_order: ['extracting', 'building', 'upgrading'],
    run: function(creep) {
      switch(creep.memory.state){
        case 'extracting':
          extracting(creep, this.job_order)
          break;
        case 'building':
          building(creep, this.job_order)
          break;
        case 'upgrading':
          upgrading(creep, this.job_order)
          break;
        default:
          creep.memory.state = 'extracting'
          break;
      }

	}
};

module.exports = {
    roleBuilder
};
