const fs = require('fs');
const gulpFactory = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const path = require('path');


// load all gulp plugins
const plugins = loadPlugins({
    'pattern': ['gulp-*'], // the glob to search for
    'replaceString': /\bgulp[\-.]/, // remove the gulp prefix from plugins' names...
    'camelizePluginName': true, // ...and convert them to camel case
    'lazy': true // only load plugins on demand
});

// initialize gulp
const gulp = plugins.help(gulpFactory);
const env = process.env.NODE_ENV || 'local';

gulp.inputPath = path.resolve(__dirname, '../assets');
gulp.outputPath = path.resolve(__dirname, '../build');


// load and register gulp tasks in current folder
for(const filename of fs.readdirSync(__dirname)) {
    const stat = fs.statSync(path.join(__dirname, filename));

    if(stat.isDirectory()) {
        // subfolder; assume submodule
        require('./' + filename)(gulp, plugins, env);
    } else {
        // subfile; only load coffee and js files to avoid .gitkeep, coffeelint.json, etc.
        const [file, extension] = filename.split('.', 2);

        if(file !== 'index' && ['coffee', 'js', 'es6'].indexOf(extension) !== -1)
            require('./' + file)(gulp, plugins, env);
    }
}
