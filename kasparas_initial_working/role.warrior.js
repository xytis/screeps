var {guarding, seeking} = require('jobs.fighting')

var roleWarrior = {

  job_order: ['guarding', 'seeking'],
  run: function(creep) {
    switch(creep.memory.state){
      case 'seeking':
        seeking(creep, this.job_order)
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
    roleWarrior
};
