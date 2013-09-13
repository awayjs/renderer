/********************************************************************************
 *
 *   usage:
 *
 ********************************************************************************
 *
 *       Default Tasks:      grunt --libversion=0.0.1
 *       TypeScript Only:    grunt ts
 *       Documentation Only: grunt doc
 *       Minify Only:        grunt min
 *
 ********************************************************************************
 *
 *  libversion = verion number of the lib defaults to 'next' if no
 *  version is specified
 *
 ********************************************************************************/

module.exports = function(grunt) {

    var version = grunt.option('libversion') || 'next';

    // Plugins used by this Grunt Script

    grunt.loadNpmTasks('grunt-typescript');
    //grunt.loadNpmTasks('grunt-contrib-yuidoc');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-concat');


    // Configuration
    grunt.initConfig( {

        //Read the package.json
        pkg: grunt.file.readJSON('package.json'),

        // Metadata / Configuration

        meta: {

            v:grunt.option('vers') || "",

            basePath: '../',
            tsFile: '../src/Away3D.ts',
            tsPath: '../src/',
            tsExportFile: '../lib/Away3D.' + version + '.js',
            tsExportUglyFile: '../lib/Away3D.' + version + '.min.js',
            tsExportFolder: '../lib/',
            tsMultiExportFolder: '../lib/src/',
            docsPath: '../docs/',
            deployPath: '../lib/'

        },

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

            /*
            MainJsFile: { // Export Concatenated JavaScript from Main TS file
                src: ['<%= meta.tsFile %>'],
                dest: '<%= meta.tsExportFile %>',
                options: {
                }
            },

            MultipleJSFiles: { // Export multiple JavaScript files from TS source

                src: ['<%= meta.tsFile %>'],
                dest: '<%= meta.tsMultiExportFolder %>',
                options: {
                }
            }
             */
        },

        concat: {

            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [ '../src/ts/libs/preloadjs-0.3.1.min.js' , '<%= meta.tsExportFile %>' ],
                // the location of the resulting JS file
                dest: '../deploy/TEST.js'

            }
        },

        // Minify

        uglify: {

            my_target: {

                files: {

                    '<%= meta.tsExportUglyFile %>': [ '<%= meta.tsExportFile %>' ]
                }

            }

        },

        // Export Documentation ( using multi export JS files )

        yuidoc: {

            compile: {

                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',

                options: {

                    paths: '<%= meta.tsMultiExportFolder %>',
                    outdir: '<%= meta.docsPath %>'

                }

            }

        }

    } );

    grunt.option.init();

    grunt.registerTask('default', ['typescript' ]); // Default Tasks
    //grunt.registerTask('default', ['typescript' , 'concat', 'uglify' , 'yuidoc'  ]); // Default Tasks
    //grunt.registerTask('ts', [ 'typescript' ]); // Export TypeScript only
    //grunt.registerTask('doc', [ 'yuidoc' ]); // Export Documentation only
    //grunt.registerTask('min', [ 'uglify' ]); // Minify only

};

