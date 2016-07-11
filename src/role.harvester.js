var {extracting, suplying, building, upgrading} = require('jobs')

var roleHarvester = {
    job_order: ['extracting', 'suplying', 'building', 'upgrading'],
    run: function(creep){
      switch(creep.memory.state){
        case 'extracting':
          extracting(creep, this.job_order)
          break;
        case 'building':
          building(creep, this.job_order)
          break;
        case 'suplying':
          suplying(creep, this.job_order)
          break;
        case 'upgrading':
          upgrading(creep, this.job_order)
          break;
        default:
          creep.memory.state = 'extracting'
          break;
      }
    },

}


module.exports = {
    roleHarvester
};
