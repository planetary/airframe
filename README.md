# Airframe

> A Project Starter Kit, made with love by [Planetary](http://planetary.io)

## What does it do?

Airframe allows you to rapidly prototype sites by providing a lightweight scaffold. It makes
suggestions without being too prescriptive.

The scaffold includes `webpack` for compilation and hot reloading, `pug` for templates, and `postcss` for smart CSS
compilation.

In addition to the compilation tasks, Airframe includes:
* A clear, concise default folder structure that is suggested but not prescribed.
* A small amount of default CSS for normalization and to provide basic grid functionality.
* Documentation (at `/docs`) that can be used as a jumping-off point for design.

### Installation

```bash
$ git clone --depth=1 https://github.com/planetary/airframe.git
$ cd airframe
$ rm -rf .git/ && git init
$ npm install
```

### Developing

Use `npm run dev` to continuously watch and re-build the project. Airframe will automatically run a server
from the `build` folder at `localhost:8080`. Webpack will hot-reload styles and scripts and will refresh
the browser automatically when templates are updated.

### Building

#### For Production
Use `npm run build` to build a production ready bundle with hashed and minified assets with support for long-term caching. Also excludes
development tools such as the documentation and strips out any other unused css rules.

#### With Development Config
Use `npm run build:dev` to build a bundle that uses the same config as `npm run dev`. Useful for generating
a bundle that reflects your development environment. The output can be inspected to see exactly what `npm run dev`
is producing, or deployed to a development staging server.

### Installing Sublime Text Helpers

#### CSS Linting

1. Open Sublime Text 3, type `Cmd+Shift+P` to open the prompt and type to select "Package Control:
   Install Package"
2. Type to select "SublimeLinter", wait until that finishes installing.
3. Open the "Install Package" prompt from step 1 again and type to select
   "SublimeLinter-contrib-stylelint", wait until that finishes installing.
4. Restart Sublime Text 3 and you should now see linting issues in the gutter of the editor.
