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
* A default style guide (at `/styles`) that can be used as a jumping-off point for design.

### Installation

```bash
$ git clone https://github.com/planetary/airframe.git
$ cd airframe
$ npm install
```

### Developing
Run `npm run dev` to continuously watch and re-build the project. Airframe will automatically run a server
from the `build` folder at `localhost:8080`. Webpack will hot-reload styles and scripts.

### Installing Sublime Text Helpers

#### CSS Linting

1. Open Sublime Text 3, type `Cmd+Shift+P` to open the prompt and type to select "Package Control:
   Install Package"
2. Type to select "SublimeLinter", wait until that finishes installing.
3. Open the "Install Package" prompt from step 1 again and type to select
   "SublimeLinter-contrib-stylelint", wait until that finishes installing.
4. Restart Sublime Text 3 and you should now see linting issues in the gutter of the editor.
