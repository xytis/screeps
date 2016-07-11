var {guarding, healing} = require('jobs.fighting')

var roleHealer = {

  job_order: ['guarding', 'healing'],
  run: function(creep) {
    switch(creep.memory.state){
      case 'healing':
        healing(creep, this.job_order)
        break;
      case 'guarding':
        guarding(creep, this.job_order)
        break;
      default:
        creep.memory.state = 'guarding'
        break;
    }
  }

}


module.exports = {
    roleHealer
};
