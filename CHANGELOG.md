All notable changes to this project will be documented in this file.

The format is based on [EZEZ Changelog](https://ezez.dev/changelog/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]
- (nothing yet)

## [5.1.0] - 2024-03-31
### Added
- `timeLeft` property
### Changed
- `restartOnly` methods supports updating timeout and instant first run
- `startOnly` methods supports updating instant first run
### Fixed
- JSDoc is invalid about return types
### Dev
- big dev deps update

## [5.0.0] - 2023-05-07
### Added
- `startOnly` method
- `restartOnly` method
### Dev
- got rid of default exports in internal files, if you (incorrectly) required internal files previously change your `require`/`import` statements
### Changed
- tutorial/readme update
- the instance is no longer returned from `start`/`stop` methods, it was useless and possibly confusing

## [4.0.2] - 2023-04-25
### Dev
- dev dependencies bump

## [4.0.1] - 2021-05-16
### Fixed
- support for pretty new node versions with common js code

## [4.0.0] - 2021-04-24
### Added
- TypeScript typings
- `started` property that indicates if timer is started

## [3.0.1] - 2020-03-13
### Fixed
- CommonJS compatibility
### Changed
- better native ESM support

## [3.0.0] - 2020-03-12
### Changed
- library now works as real esmodule with commonjs fallback

## [2.0.1] - 2018-09-07
### Fixed
- esmodule syntax not applied everywhere

## [2.0.0] - 2018-08-23
### Fixed
- handling of incorrect time values
- handling of Infinity value as time
- dev deps upgraded, fixing audit warnings
### Changed
- commonjs syntax to esmodule (commonjs available in `dist` folder)
- `dist` is transpiled for modern js environment, please use own further transpilation if you need to support old stuff

## [1.0.0] - 2018-05-24
### Added
- first version
