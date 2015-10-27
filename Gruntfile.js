module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec: {
      compile_ts : 'tsc --removeComments -out public/js/tickergrid.js src/Main.ts'
    },

    watch: {
      scripts: {
        files: 'src/**/*.ts',
        tasks: ['exec']
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('default', ['watch']);

};