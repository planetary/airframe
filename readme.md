# Airframe

> A Project Starter Kit, made with love by [Planetary](http://planetary.io)

## What does it do?

Airframe allows you to rapidly prototype sites by providing a lightweight scaffold. It makes suggestions without being too prescriptive.

The scaffold includes `gulp` for compilation, `jade` for templates, `scss` for smart CSS compilation, and `browserify` for Javascript compilation.

In addition to the compilation tasks, Airframe includes:
* A clear, concise default folder structure that is suggested but not prescribed.
* A small amount of default SCSS for normalization and to provide basic grid functionality.
* Two `browserify` transforms: [`bulkify`](https://github.com/substack/bulkify) which allow you to glob entire folders of client-side JS and [`brfs`](https://github.com/substack/brfs) which allows you to use `fs.readFile[Sync]` from client-side JS.
* A default style guide (at `/styles`) that can be used as a jumping-off point for design.

### Getting Started

```bash
$ git clone git@github.com:planetarycorp/airframe
$ cd airframe
$ npm install
```

Then, run `gulp build` to build the project.

### Developing
Run `gulp` to continuously watch and re-build the project. Airframe will automatically run a server from the `build` folder at `localhost:4900`.

### Gulp Tasks
| Task            | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| build           |  builds a development version of the site                                  |
| bundle:dev      |  watches src/scripts/index.js require tree for changes and runs browserify |
| default         |  builds the site, serves it, and watches files for changes                 |
| help            |  Display this help text.                                                   |
| images          |  compresses images and moves them to the build folders                     |
| lint:js         |  runs jshint against the unbundled scripts                                 |
| lint:scss       |  lints the scss                                                            |
| serve           |  serves the build folder on localhost port 4900                            |
| styles          |  compiles the scss to the build folder                                     |
| templates       |  compiles the jade templates to the build folder                           |
| watch           |  watches all the files                                                     |
| watch:bundle    |  runs browserify, using src/scripts/index.js as an entry point             |
| watch:images    |  watches the source images for changes and runs the images task            |
| watch:js        |  watches js files for changes and runs the lint:js task on change          |
| watch:styles    |  watches the scss files and runs the styles task                           |
| watch:templates |  watches the templates for changes and runs the templates task             |

Run `gulp help` at any time to see this list of tasks.

### Installing Sublime Text Helpers

#### SCSS Linting

1. Open Sublime Text 3, type `Cmd+Shift+P` to open the prompt and type to select "Package Control: Install Package"
2. Type to select "SublimeLinter", wait until that finishes installing.
3. Open the "Install Package" prompt from step 1 again and type to select "SublimeLinter-contrib-scss-lint", wait until that finishes installing.
4. From the command line, run `sudo gem install scss-lint`
4. Restart Sublime Text 3 and you should now see linting issues in the gutter of the editor.
