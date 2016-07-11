var {extracting, upgrading} = require('jobs')

var roleUpgrader = {

  job_order: ['extracting', 'upgrading'],
  run: function(creep) {
    switch(creep.memory.state){
      case 'extracting':
        extracting(creep, this.job_order)
        break;
      case 'upgrading':
        upgrading(creep, this.job_order)
        break;
      default:
        creep.memory.state = 'extracting'
        break;
    }
  }

}


module.exports = {
    roleUpgrader
};
