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

### Installing Sublime Text Helpers

#### SCSS Linting

1. Open Sublime Text 3, type `Cmd+Shift+P` to open the prompt and type to select "Package Control: Install Package"
2. Type to select "SublimeLinter", wait until that finishes installing.
3. Open the "Install Package" prompt from step 1 again and type to select "SublimeLinter-contrib-scss-lint", wait until that finishes installing.
4. From the command line, run `sudo gem install scss-lint`
4. Restart Sublime Text 3 and you should now see linting issues in the gutter of the editor.
