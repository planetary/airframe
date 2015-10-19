# Airframe

> A Project Starter Kit, made with love by [Planetary](http://planetary.io)

## What does it do?

Airframe allows you to rapidly prototype sites by providing a lightweight scaffold. It makes
suggestions without being too prescriptive.

The scaffold includes `gulp` for compilation, `jade` for templates, `scss` for smart CSS
compilation, and `browserify` for Javascript compilation.

In addition to the compilation tasks, Airframe includes:
* A clear, concise default folder structure that is suggested but not prescribed.
* A small amount of default SCSS for normalization and to provide basic grid functionality.
* Four `browserify` transforms:
  * [`babelify`](https://github.com/babel/babelify): allows you to write ES6 on the frontend
  * [`brfs`](https://github.com/substack/brfs): allows you to use `fs.readFile[Sync]`
  * [`bulkify`](https://github.com/substack/bulkify): allows you to glob entire folders
  * [`envify`](https://github.com/hughsk/envify): allows you to use `process.env` in frontend code
* A default style guide (at `/styles`) that can be used as a jumping-off point for design.

### Getting Started

```bash
$ git clone git@github.com:planetarycorp/airframe
$ cd airframe
$ npm install
```

Then, run `gulp build` to build the project.

### Developing
Run `gulp` to continuously watch and re-build the project. Airframe will automatically run a server
from the `build` folder at `localhost:3000`.

### Gulp Tasks
| Task              |  Description                                                                           |
| ----------------- |  ------------------------------------------------------------------------------------- |
| build             |  builds all the registered static resources from assets into build                     |
| build:fonts       |  moves fonts to the build folder                                                       |
| build:images      |  compresses images and moves them to the build folder                                  |
| build:scripts     |  bundles all client-side javascript files into the build folder via browserify         |
| build:styles      |  compiles all scss files into the build folder                                         |
| build:templates   |  compiles the jade templates to the build folder                                       |
| clean             |  deletes all build artifacts                                                           |
| default           |  builds the site, serves it locally and redeploys when files are changed               |
| help              |  Display this help text.                                                               |
| lint              |  runs all registered linters and out prints any detected issues                        |
| lint:scripts      |  lints all non-vendor js(x) files against .eslintrc                                    |
| lint:styles       |  lints all non-vendor scss files against scss-lint.yml                                 |
| serve             |  serves static templates locally                                                       |
| serve:browsersync |  proxies the localhost server via BrowserSync to dynamically update assets             |
| watch             |  waits for changes in project files and attempts to rebuild them                       |
| watch:fonts       |  watches the source fonts for changes and moves them to the build folder when they do  |
| watch:images      |  watches the source images folders and recompresses them when changed                  |
| watch:scripts     |  waits for client-side javascript files to change, then rebuilds them                  |
| watch:styles      |  waits for scss files to change, then rebuilds them                                    |
| watch:templates   |  watches the templates folder for changes and recompiles them                          |

Run `gulp help` at any time to see this list of tasks.

### Installing Sublime Text Helpers

#### SCSS Linting

1. Open Sublime Text 3, type `Cmd+Shift+P` to open the prompt and type to select "Package Control:
   Install Package"
2. Type to select "SublimeLinter", wait until that finishes installing.
3. Open the "Install Package" prompt from step 1 again and type to select
   "SublimeLinter-contrib-scss-lint", wait until that finishes installing.
4. From the command line, run `sudo gem install scss-lint`
4. Restart Sublime Text 3 and you should now see linting issues in the gutter of the editor.
