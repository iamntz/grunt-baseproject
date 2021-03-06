module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //  Javascripts
    jshint: {
      files: [
        'Gruntfile.js'
        ,'<%= uglify.app.src %>'
      ],
      options: {
        globals: {
          jQuery   : true
          ,console : true
          ,module  : true
          ,document: true
        },
        laxcomma : true
        ,laxbreak: true
        ,sub     : true
      }
    },

    uglify: {
      options : {
        sourceMap: function(path){
          path = path.replace(/assets\/dist\/javascripts\/(.*).min.js/, "$1.js");
          path = path.replace(/assets\/dist\/vendor\/(.*).min.js/, "$1.js");

          return path + 'map';
        }

        ,sourceMappingURL: function (path) {
          path = path.replace(/assets\/dist\/javascripts\/(.*).min.js/, "../../../$1.jsmap");
          path = path.replace(/assets\/dist\/vendor\/(.*).min.js/, "../../../$1.jsmap");

          return path;
        }
      }

      ,app: {
        src: [
          'assets/src/javascripts/*.js'
          ,'assets/src/javascripts/**/*.js'
        ],
        dest: 'assets/dist/javascripts/<%= pkg.name %>.min.js'
      }

      ,vendor : {
        src: [
          'assets/src/vendor/jquery/jquery-2.0.2.js'
        ],
        dest: 'assets/dist/vendor/vendor.min.js'
      }
    },

    qunit: {
      all: [ "assets/src/tests/*.html"]
    },


    // styles
    sass: {
      options: {
        style    : 'expanded',
        sourcemap:true
      },
      app: {
        src : [
          'assets/src/stylesheets/*.scss'
          ,'assets/src/stylesheets/**/*.scss'
        ],
        dest : 'assets/dist/stylesheets/screen.css',
        options : {
          // compass  : true
        }
      }
    },


    // the rest of the assets
    copy : {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'assets/src',
            src: [
              'vendor/**/*'
              ,'images/*'
              ,'images/**/*'
              ,'fonts/**/*'
            ],
            dest: 'assets/dist/'
          }
        ]
      }
    },


    // awesomeness
    watch: {
      options: {
        nospawn       : true
        ,debounceDelay: 250
      },

      qunit : {
        files: [
          'assets/src/tests/*.test.html'
          ,'assets/src/tests/*.test.js'
        ],
        tasks: [ 'jshint', 'qunit' ]
      },

      css: {
        options: {
          livereload: true
        },
        files: [ '<%= sass.app.src %>' ],
        tasks: ["css"]
      },

      assets : {
        files: [
          'assets/src/vendor/**/*'
          ,'assets/src/images/*'
          ,'assets/src/images/**/*'
          ,'assets/src/fonts/**/*'
        ],
        tasks: [ 'copy' ]
      },

      js : {
        files: [ '<%= uglify.app.src %>' ],
        tasks: [ 'jshint', 'uglify' ]
      }
    },


    csscss: {
      dist: {
        src: [ '<%= sass.app.dest %>' ]
      }
    },


    sprite:{
      all: {
        src         : ['assets/src/images/sprites/*.png']
        ,destImg    : 'assets/dist/images/sprites.png'
        ,imgPath    : '../images/sprites.png'
        ,algorithm  : 'binary-tree'
        ,padding    : 10
        ,engine     : 'auto'
        ,destCSS    : 'assets/src/stylesheets/sprites/_sprites.scss'
        ,cssTemplate: 'assets/helpers/spritesmith.sass.template.mustache'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-csscss');
  grunt.loadNpmTasks('grunt-spritesmith');



  grunt.registerTask('js', [ 'jshint', 'qunit', 'uglify']);
  grunt.registerTask('css', [ 'sprite', 'sass' ]);
  grunt.registerTask('assets', [ 'copy' ]);

  grunt.registerTask('default', [ 'js', 'css', 'assets' ]);
  grunt.registerTask('dev', ['watch']);
};