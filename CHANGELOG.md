All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]
(nothing yet)

## [4.0.2+]
### Dev
- got rid of default exports in internal files, if you (incorrectly) required internal files previously change your `require`/`import` statements
### Changed
- tutorial/readme update

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
