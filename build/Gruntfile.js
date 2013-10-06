/****************************************************************************************************************************************************************
 *   Grunt File Usage:
 ****************************************************************************************************************************************************************
 *
 *  Export Documentation, TypeScript and Minify:
 *
 *      grunt
 *
 *  Export TypeScript and Minify:
 *
 *      grunt lib
 *
 *****************************************************************************************************************************************************************
 *  Options
 *****************************************************************************************************************************************************************
 *
 *  Export lib version, defaults to 'next' if not specified:
 *
 *      grunt --libversion=0.0.1
 *
 *
 *
 ****************************************************************************************************************************************************************
 *    Installing Dependencies:
 ****************************************************************************************************************************************************************
 *
 *  To install Grunt dependencies. Run from 'build' folder:
 *
 *      OSX :       sudo npm install
 *      Windows:    npm install
 *
 ****************************************************************************************************************************************************************/

module.exports = function(grunt) {


    var version = grunt.option('libversion') || 'next';                     // Check for a version number | defaults to next if not specified

    //--------------------------------------------------------------------------------------------------------------
    // Plugins used by Grunt Script
    //--------------------------------------------------------------------------------------------------------------

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //--------------------------------------------------------------------------------------------------------------
    // Grunt Config
    //--------------------------------------------------------------------------------------------------------------

    grunt.initConfig( {

        //--------------------------------------------------------------------------------------------------------------
        // Read the package.json
        //--------------------------------------------------------------------------------------------------------------

        pkg: grunt.file.readJSON('package.json'),

        //--------------------------------------------------------------------------------------------------------------
        // Metadata / Configuration
        //--------------------------------------------------------------------------------------------------------------

        meta: {

            v:grunt.option('vers') || "",                                   // Optional library version string
            tsFile: '../src/Away3D.ts',                                     // TypeScript export source
            tsPath: '../src/',                                              // TypeScript source folder

            tsExportFile: '../lib/Away3D.' + version + '.js',               // JavaScript export target
            tsExportUglyFile: '../lib/Away3D.' + version + '.min.js',       // JavaScript minified target

            tsExportFolder: '../lib/',                                      // Export folder
            tsMultiExportFolder: '../lib/src/',                             // Emit to multiple JS - folder
            docsPath: '../docs/'                                            // Documentation export path

        },

        //--------------------------------------------------------------------------------------------------------------
        // Export and compile TypeScript
        //--------------------------------------------------------------------------------------------------------------

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

	        /*
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
			*/
        },

        //--------------------------------------------------------------------------------------------------------------
        // Concatenate file ( currently not used )
        //--------------------------------------------------------------------------------------------------------------

        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [ '<%= meta.tsExportFile %>' ],
                // the location of the resulting JS file
                dest: ''

            }
        },

        //--------------------------------------------------------------------------------------------------------------
        // Minify JavaScript source
        //--------------------------------------------------------------------------------------------------------------

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

        //--------------------------------------------------------------------------------------------------------------
        // Export Documentation ( using multi export JS files )
        //--------------------------------------------------------------------------------------------------------------

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

    //--------------------------------------------------------------------------------------------------------------
    // Register Grunt tasks
    //--------------------------------------------------------------------------------------------------------------

    grunt.option.init();
	grunt.registerTask('default',   ['ts' , 'uglify' , 'yuidoc' ]); // Default Tasks
	grunt.registerTask('lib',   ['ts' , 'uglify' ]); // Export TypeScript only

};

