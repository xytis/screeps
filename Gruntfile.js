var credentials = require("./credentials.json")

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-babel');

    grunt.initConfig({
        "screeps": {
            options: {
                email: credentials.email,
                password: credentials.password,
                branch: credentials.branch,
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        },
        "babel": {
            options: {
                sourceMap: true,
                presets: ['es2015'],
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist'
                }]
            }
        }
    });
    grunt.registerTask('default', ['babel', 'screeps']);
};

