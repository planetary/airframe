v1.1.0
  date: 2015-10-19
  changes:
    - add BrowserSync serving support 
    - improved CSS component styling
    - convert tasks to es6 (via babel)
    - change js linter to eslint (better jsx support)
    - change gulp task registration format from `(gulp, plugins, path)` to `(gulp, plugins, env)`
    - switch to `gulp-rev-all` for bulk revisioning
    - switch to `gulp-imagemin` as it seems to be updated more often than `gulp-image`
    - add sample circleci config
    - more consistent task names
    - drop node 0.10 support

v1.0.9:
  date: 2015-06-12
  changes:
    - First v1.1 release candidate
    - Updated to new build system
    - Add default linting rules to match the Planetary style guides
    - Integrate `ecstatic` with `browser-sync`
    - Rename `src` folder to `assets`
    - Rename `tasks` folder to `gulp`

v1.0.0:
  date: 2015-03-22
  changes:
    - Updat the README to include information about Airframe.
    - Update src/ folder structure to reflect more logical naming
    - Break Gulpfile into tasks/* and parent loader
    - Add gulp-notify to introduce build notifications
    - Add watchify, bulkify, brfs for Javascript compilation conveniences
    - Change build folder from dist/ to build/
    - Add ecstatic for self-serving of build folder
    - Add LICENSE
    - Sync versioning with slush-airframe

v0.0.1:
  date: 2014-06-23
  changes:
    - Initial release.
