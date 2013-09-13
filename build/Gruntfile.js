module.exports = function(grunt) {

    var version = grunt.option('libversion') || 'next';

    // Plugins used by this Grunt Script

    grunt.loadNpmTasks('grunt-typescript');


    // Configuration
    grunt.initConfig( {

        //Read the package.json
        pkg: grunt.file.readJSON('package.json'),

        // Metadata / Configuration

        // Export TypeScript Source

        typescript: {



            base: { // Export Concatenated JavaScript from Main TS file
                src: '../src/Away3D.ts',
                dest: '../lib/src/Away.js',
                options: {
                    target: 'ES5',
                    sourcemap: true

                }
            }

        }

    } );

    grunt.option.init();

    grunt.registerTask('default', ['typescript' ]); // Default Tasks

};

