var path = require( 'path' ),
    gulp = require( 'gulp' ),
    loadPlugins = require( 'gulp-load-plugins' ),
    includeAll = require( 'include-all' );

var plugins = loadPlugins( {
    pattern: [ 'gulp-*', 'merge-*', 'run-*', 'main-*' ], // the glob to search for
    replaceString: /\bgulp[\-.]|run[\-.]|merge[\-.]|main[\-.]/, // remove from the name of the module when adding it to the context
    camelizePluginName: true,
    lazy: true // lazy-load plugins on demand
} );

/**
 * Loads Gulp configuration modules from the specified
 * relative path. These modules should export a function
 * that, when run, should either load/configure or register
 * a Gulp task.
 */
var loadTasks = function( relPath ) {
    return includeAll( {
        dirname: path.resolve( __dirname, relPath ),
        filter: /(.+)\.js$/
    } ) || {};
};

var setupTasks = function( tasks ) {
    for( var taskName in tasks ) {
        if( tasks.hasOwnProperty( taskName ) ) {
            tasks[ taskName ]( gulp, plugins, path );
        }
    }
};

var tasks = loadTasks( './tasks' );
setupTasks( tasks );
