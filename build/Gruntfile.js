/********************************************************************************
 *   Grunt File Usage:
 ********************************************************************************
 *
 *       Default Tasks:      grunt --libversion=0.0.1
 *       TypeScript Only:    grunt ts
 *       Documentation Only: grunt doc
 *       Minify Only:        grunt min
 *
 *  libversion = verion number of the lib defaults to 'next' if no
 *  version is specified
 *
 ********************************************************************************
 *    Installing Dependencies:
 ********************************************************************************
 *
 *  To install Grunt dependencies. Run from 'build' folder:
 *
 *      OSX : sudo npm install
 *
 ********************************************************************************/

module.exports = function(grunt) {

    var version = grunt.option('libversion') || 'next';

    // Plugins used by this Grunt Script

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

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

        ts: {

            MainJsFile: {
                src: ['<%= meta.tsFile %>'],
                out: '<%= meta.tsExportFile %>',
                options: {
                    target: 'es5',
                    sourcemap: true,
                    declaration: true,
                    comments: true
                }
            },

            MultipleJsFile: {
                src: ['<%= meta.tsFile %>'],
                outDir: '<%= meta.tsMultiExportFolder %>',
                options: {
                    target: 'es5',
                    sourcemap: false,
                    declaration: false,
                    comments: true
                }
            }

        },

        // Concatenate ( NOT CURRENTLY USED )
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [ '<%= meta.tsExportFile %>' ],
                // the location of the resulting JS file
                dest: '../deploy/CONACT_TEST.js'

            }
        },

        // Minify
        uglify: {

            options: {
                mangle: false
            },
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
                    extension:'.ts',
                    paths: '<%= meta.tsPath %>',
                    outdir: '<%= meta.docsPath %>'
                }
            }
        }



    } );

    grunt.option.init();
    grunt.registerTask('default',   ['ts' , 'uglify' , 'yuidoc' ]); // Default Tasks
    //grunt.registerTask('ts',        [ 'ts' ]);                      // Export TypeScript only
    //grunt.registerTask('doc',       [ 'yuidoc' ]);                  // Export Documentation only
    //grunt.registerTask('min',       [ 'uglify' ]);                  // Minify only

};

