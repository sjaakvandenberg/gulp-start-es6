import gulp         from 'gulp';
import del          from 'del';               // delete files
import jade         from 'gulp-jade';         // Jade templates
import babel        from 'gulp-babel';        // ES6 JS
import watch        from 'gulp-watch';        // watch files
import concat       from 'gulp-concat';       // concat files
import rename       from 'gulp-rename';       // rename files
import stylus       from 'gulp-stylus';       // CSS preprocessing
import uglify       from 'gulp-uglify';       // minify JS
import changed      from 'gulp-changed';      // changed files
import imagemin     from 'gulp-imagemin';     // minify images
import pngquant     from 'imagemin-pngquant'; // minify PNG
import minifycss    from 'gulp-minify-css';   // minify CSS
import minifyhtml   from 'gulp-htmlmin';      // minify HTML
import browserSync  from 'browser-sync';      // refresh browser

// path configuration --------------------------------------------------------

const paths = {
  source: {
    root:       './source/*',                   // paths.source.root
    fonts:      './source/fonts/**/*',          // paths.source.fonts
    images:     './source/images/*',            // paths.source.images
    templates:  './source/templates/*',         // paths.source.templates
    scripts:    './source/scripts/*',           // paths.source.scripts
    vendor:     './source/scripts/vendor/*',    // paths.source.vendor
    styles:     './source/styles/*',            // paths.source.styles
  },
  public: {
    root:     './public/',                      // paths.public.root
    fonts:    './public/fonts/',                // paths.public.fonts
    images:   './public/images/',               // paths.public.images
    scripts:  './public/scripts/',              // paths.public.scripts
    styles:   './public/styles/',               // paths.public.styles
  },
};

// options configuration -----------------------------------------------------

const config = {
  // browsersync -------------------------------------------------------------
  // http://www.browsersync.io/docs/options/
  browsersync:                                  // config.browsersync
  {
    ui:                                         // bool, access interface
    {
      port: 8080,                               // interface port
    },
    files: paths.source.root + '**/*',          // files to watch
    watchOptions:                               // watch options for gaze
    {
      interval: 100,                            // fs.watchFile interval (ms)
      debounceDelay: 100,                       // event delay (ms)
      mode: 'auto',                             // auto, watch, poll
    },
    server:                                     // static server
    {
      baseDir: paths.public.root,               // serve files from here
      directory: false,                         // directory listing
    },
    port: 8888,                                 // server port
    https: false,                               // static HTTPS
    ghostMode:                                  // mirror inputs
    {
      clicks: true,                             // mouse clicks
      forms: true,                              // form interactions
      scroll: true,                             // scroll events
    },
    logLevel: 'info',                           // info, debug, warn, silent
    logPrefix: '',                              // console logging prefix
    logConnections: true,                       // display connected browsers
    logFileChanges: true,                       // display info about changes
    logSnippet: true,                           // log the snippet to console
    tunnel: 'babel',                            // bool/localtunnel.me prefix
    online: undefined,                          // bool to check connectivity
    open: false,                                // bool, external, tunnel
    browser: 'google chrome',                   // array of browsers
    reloadOnRestart: true,                      // reload browsers upon restart
    notify: false,                              // bubble notifications
    scrollProportionally: true,                 // sync viewport to top
    scrollThrottle: 0,                          // scroll event interval (ms)
    reloadDelay: 0,                             // pause before reload (ms)
    injectChanges: true,                        // inject CSS changes/refresh
    startPath: null,                            // path to open browser at
    minify: false,                              // minify client side JS
    host: null,                                 // host override (string IP)
    codeSync: true,                             // change events to browsers
    timestamps: true,                           // append timestamps to files
  },

  // minifycss ---------------------------------------------------------------
  // https://github.com/jonathanepollack/gulp-minify-css
  minifycss:                                    // config.minifycss
  {
    advanced: true,                             // advanced optimizations
    aggressiveMerging: true,                    // aggressive property merging
    benchmark: false,                           // time spent cleaning up
    compatibility: false,                       // compatibility mode
    debug: false,                               // minification statistics
    inliner: false,                             // @import inliner hash
    keepBreaks: false,                          // keep line breaks
    keepSpecialComments: false,                 // * all, 1 first, 0 none
    processImport: false,                       // process @import rules
    rebase: false,                              // URL rebasing
    relativeTo: null,                           // abs @import rules path
    restructuring: false,                       // adv optimizations
    root: null,                                 // rel @import rules path
    roundingPrecision: 2,                       // default 2, disable -1
    shorthandCompacting: true,                  // shorthand compacting
    sourceMap: false,                           // exposes source map
    sourceMapInlineSources: false,              // source map inline sources
    target: null,                               // rebase path
  },

  // imagemin ----------------------------------------------------------------
  // https://github.com/sindresorhus/gulp-imagemin
  imagemin:                                     // config.imagemin
  {
    optimizationLevel: 3,                       // for PNG files
    progressive: true,                          // for JPG files
    interlaced: false,                          // for GIF files
    multipass: false,                           // for SVG files
    svgoPlugins: [{
      removeViewBox: false,
    },],                                        // svgo plugins
    use: [pngquant()],                          // additional plugins
  },

  // stylus ------------------------------------------------------------------
  // https://github.com/stevelacy/gulp-stylus
  stylus:                                       // config.stylus
  {},

  // jade --------------------------------------------------------------------
  // http://jade-lang.com/api/
  jade: {
    pretty: true,
  },

  // uglify ------------------------------------------------------------------
  // https://github.com/terinjokes/gulp-uglify
  uglify: {
    preserveComments: 'all',                    // some, all, function()
    // mangle: true,
  },

  // babel -------------------------------------------------------------------
  // https://babeljs.io/docs/usage/options
  babel: {
    comments: false,                            // output comments
  },

  // minifyhtml --------------------------------------------------------------
  // https://github.com/kangax/html-minifier
  minifyhtml: {
    removeComments: false,                      // remove comments
    removeCommentsFromCDATA: false,             // comments (scripts/styles)
    removeCDATASectionsFromCDATA: false,        // CDATA (scripts/styles)
    collapseWhitespace: true,                   // remove white space
    conservativeCollapse: false,                // white space -> 1 space
    preserveLineBreaks: false,                  // white space -> 1 line
    collapseBooleanAttributes: false,           // remove bools attrib values
    removeAttributeQuotes: false,               // remove attribs quotes
    removeRedundantAttributes: false,           // remove default's attribs
    preventAttributesEscaping: false,           // no attrib values escaping
    useShortDoctype: true,                      // doctype -> HTML5 doctype
    removeEmptyAttributes: false,               // remove whitespace attribs
    removeScriptTypeAttributes: false,          // remove script type attrib
    removeStyleLinkTypeAttributes: false,       // remove style type attrib
    removeOptionalTags: false,                  // remove unrequired tags
    removeIgnored: false,                       // remove <%, %>, <?, ?>
    removeEmptyElements: false,                 // remove empty elements
    lint: false,                                // toggle linting
    keepClosingSlash: false,                    // keep s elem trailing slash
    caseSensitive: false,                       // case sensitive attribs
    minifyJS: false,                            // UglifyJS minification
    minifyCSS: false,                           // clean-css minification
    minifyURLs: false,                          // URL minification
    ignoreCustomComments: [],                   // ignore comments (regex)
    processScripts: [],                         // script type minification
    maxLineLength: undefined,                   // maximum line length
  },
};

// individual tasks -----------------------------------------------------------

gulp.task('stylus', () => {
  return gulp.src(paths.source.styles)
  .pipe(changed(paths.source.styles))
  .pipe(stylus(config.stylus))
  .pipe(gulp.dest(paths.public.styles))
  .pipe(browserSync.reload({
    stream: true,
  }));
});

gulp.task('scripts', () => {
  return gulp.src(paths.source.scripts)
    .pipe(changed(paths.source.scripts))
    .pipe(babel(config.babel))
    .pipe(gulp.dest(paths.public.scripts))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('jade', () => {
  return gulp.src(paths.source.templates)
    .pipe(changed(paths.source.templates))
    .pipe(jade(config.jade))
    .pipe(gulp.dest(paths.public.root))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('vendor', () => {
  return gulp.src(paths.source.vendor)
    .pipe(changed(paths.public.scripts))
    .pipe(concat('vendor.js'))
    .pipe(uglify(config.uglify))
    .pipe(gulp.dest(paths.public.scripts))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('uglify', () => {
  return gulp.src(paths.source.scripts)
    .pipe(changed(paths.public.scripts))
    .pipe(concat('main.js'))
    .pipe(uglify(config.uglify))
    .pipe(gulp.dest(paths.public.scripts))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('minifycss', () => {
  return gulp.src(paths.public.styles + '*.css')
    .pipe(changed(paths.public.styles))
    .pipe(minifycss(config.minifycss))
    .pipe(gulp.dest(paths.public.styles))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('minifyhtml', () => {
  return gulp.src(paths.public.root + '*.html')
    .pipe(changed(paths.public.root))
    .pipe(minifyhtml(config.minifyhtml))
    .pipe(gulp.dest(paths.public.root))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('imagemin', () => {
  return gulp.src(paths.source.images)
    .pipe(changed(paths.public.images))
    .pipe(imagemin(config.imagemin))
    .pipe(gulp.dest(paths.public.images))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('fonts', () => {
  return gulp.src(paths.source.fonts)
    .pipe(changed(paths.public.fonts))
    .pipe(gulp.dest(paths.public.fonts))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('clean', () => {
  del(paths.public.root);
});

gulp.task('serve', () => {
  browserSync(config.browsersync);
  gulp.watch(paths.source.templates, ['jade']);
  gulp.watch(paths.source.scripts, ['scripts']);
  gulp.watch(paths.source.styles, ['stylus']);
});

gulp.task('info', () => {
  console.log('');
  console.log('                  ,╥╦╓                                    ');
  console.log('                ╦╬╙` ╙╬           ,╬                      ');
  console.log('              ╓╬╨                 ╬²                      ');
  console.log('             ╔╬²    ╓╕           ╬╜                       ');
  console.log('            ╓╬*    ,╬²  ╬╛  ╔å  ╬╝   ╬╓≡╨╬╬               ');
  console.log('            ╬╬    ╔╬╝  ╬╜  ╔╬  ╠╝  ,╫╬^ ╔å .╦*            ');
  console.log('            ╬╬,╓╦╝╠╬  ╔╬,╓╝╠╕,╥╬,╦#╠å ┌╬▒╓#╙              ');
  console.log('             ╙╙^  ╬^   "^` ^"` "^`╦╬  `╙^`                ');
  console.log('                  ²              ╦╬                       ');
  console.log('                                -╝`                       ');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                  Available commands:                   ║');
  console.log('╟────────────────────────────────────────────────────────╢');
  console.log('║             gulp           gulp minify                 ║');
  console.log('║             gulp clean     gulp minifycss              ║');
  console.log('║             gulp jade      gulp minifyhtml             ║');
  console.log('║             gulp stylus    gulp uglify                 ║');
  console.log('║             gulp scripts   gulp imagemin               ║');
  console.log('║             gulp serve                                 ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
});

// main tasks ----------------------------------------------------------------

gulp.task('default', ['jade', 'stylus', 'scripts', 'serve']);
gulp.task('minify', ['minifycss', 'minifyhtml', 'uglify', 'vendor', 'fonts']);
