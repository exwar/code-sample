module.exports = function(grunt){

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*!\n * <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %>\n * <%= pkg.author %> | <%= pkg.email %>     \n */\n',
      production: false
    },

    htmlhint: {
      build: {
	options: {
	  'tag-pair': true,
	  'tagname-lowercase': true,
	  'attr-lowercase': true,
	  'attr-value-double-quotes': true,
	  'doctype-first': true,
	  'spec-char-escape': true,
	  'id-unique': true,
	  'style-disabled': true
	},

	files: {
	  src: ['_html/**/*.html']
	}
      }
    },

    modernizr: {
      build: {
	devFile: 'js/general/modernizr-dev.js',
	outputFile: 'js/general/modernizr.min.js',

	extra: {
	  shiv: true,
	  printshiv: false,
	  load: true,
	  mq: true,
	  cssclasses: true
	},
	extensibility: {
	  addtest: false,
	  prefixed: false,
	  teststyles: true,
	  testprops: true,
	  testallprops: true,
	  hasevents: false,
	  prefixes: true,
	  domprefixes: true
	},

	tests: ['csstransforms', 'csstransforms3d', 'csstransitions', 'inlinesvg', 'touch', 'flexbox']
      }
    },

    concat: {
      plugins: {
	options: {
	  separator: ';'
	},
	files:{
	  'js/plugins.js': ['js/plugins/**/*.js']
	}
      }
    },

    uglify: {
      plugins: {
	options: {
	  preserveComments: 'none'
	},
	files: {
	  'js/plugins.min.js': ['js/plugins.js']
	}
      },
      main: {
	options: {
	  banner: '<%= meta.banner %>',
	  beautify: false
	},
	files: {
	  'js/main.min.js': ['js/main.js']
	}
      }
    },

    compass: {
      build: {
	options: {
	  basePath: './',
	  httpPath: '/',
	  sassDir: 'sass',
	  cssDir: 'css',
	  imagesDir: 'img',
	  fontsDir: 'fonts',
	  javascriptsDir: 'js',
	  relativeAssets: true,
	  noLineComments: true
	}
      }
    },

    autoprefixer: {
      build: {
	options: {

	},
	files: {
	  'css/main.css': 'css/main.css'
	}
      }
    },

    csso: {
      build: {
	options: {
	  report: 'min',
	  banner: '<%= meta.banner %>'
	},
	files: {
	  'css/main.css': 'css/main.css'
	}
      }
    },

    imagemin: {
      jpg: {
	options: {
	  progressive: true,
	  cache: false
	}
	, files: [{
	  expand: true,
	  cwd: 'img',
	  src: [
	    '**/*.{jpg, jpeg}'
	  ],
	  dest: 'img'
	},
	  {
	    expand: true,
	    cwd: '_temp',
	    src: [
	      '**/*.{jpg, jpeg}'
	    ],
	    dest: '_temp'
	  }]
      },
      png: {
	options: {
	  pngquant: true,
	  cache: false
	}
	, files: [{
	  expand: true,
	  cwd: 'img',
	  src: [
	    '**/*.png'
	  ],
	  dest: 'img'
	},
	  {
	    expand: true,
	    cwd: '_temp',
	    src: [
	      '**/*.png'
	    ],
	    dest: '_temp'
	  }]
      },
      gif: {
	options: {
	  interlaced: true,
	  cache: false
	}
	, files: [{
	  expand: true,
	  cwd: 'img',
	  src: [
	    '**/*.gif'
	  ],
	  dest: 'img'
	},
	  {
	    expand: true,
	    cwd: '_temp',
	    src: [
	      '**/*.gif'
	    ],
	    dest: '_temp'
	  }]
      }
    },

    css_mqpacker: {
      main: {
	files: {
	  'css/main.css': 'css/main.css'
	}
      }
    },

    watch: {
      options: {
	livereload: true
      },

      html: {
	files: ['./**/*.html'],
	tasks: ['htmlhint']
      },

      css: {
	files: ['sass/**/*.sass', 'sass/**/*.scss'],
	tasks: ['buildCss']
      },

      imgJpg: {
	files: ['img/**/*.{jpg, jpeg}', '_temp/**/*.{jpg, jpeg}'],
	tasks: ['buildJpg']
      },
      imgPng: {
	files: ['img/**/*.png', '_temp/**/*.png'],
	tasks: ['buildPng']
      },
      imgGif: {
	files: ['img/**/*.gif', '_temp/**/*.gif'],
	tasks: ['buildGif']
      },

      jsPlugins: {
	files: ['js/plugins/**/*.js'],
	tasks: ['buildJsPlugins']
      },
      jsMain: {
	files: ['js/login.js', 'js/main.js'],
	tasks: ['buildJsMain']
      },

      grunt: {
	files: ['gruntfile.js'],
	tasks: ['buildCss', 'mdzr', 'buildJs']
      },

      mdzr: {
	files: ['js/general/modernizr-dev.js'],
	tasks: ['mdzr']
      }
    },

    browserSync: {
      dev: {
	bsFiles: {
	  src : [
	    'css/main.css',

	    'js/main.js',
	    'js/plugins.min.js',

	    'img/**/*',
	    '_html/**/*.html'
	  ]
	},
	options: {
	  watchTask: true,
	  startPath: '_html/index.html',
	  open: 'external',
	  server: {
	    baseDir: ".",
	    index: "index.html"
	  }
	}
      }
    }
  });

  grunt.registerTask('default', ['browserSync', 'watch']);
  grunt.registerTask('build', ['buildImg', 'buildCss', 'buildJs']);

  grunt.registerTask('mdzr', ['modernizr']);

  grunt.registerTask('buildCss',  ['compass', 'autoprefixer', 'css_mqpacker', 'csso'])

  grunt.registerTask('buildJpg',  ['newer:imagemin:jpg']);
  grunt.registerTask('buildPng',  ['newer:imagemin:png']);
  grunt.registerTask('buildGif',  ['newer:imagemin:gif']);
  grunt.registerTask('buildImg',  ['buildJpg', 'buildPng', 'buildGif']);

  grunt.registerTask('buildJsPlugins',  ['concat:plugins', 'uglify:plugins']);
  grunt.registerTask('buildJsMain', ['uglify:main']);
  grunt.registerTask('buildJs',  ['buildJsPlugins', 'buildJsMain']);
};
