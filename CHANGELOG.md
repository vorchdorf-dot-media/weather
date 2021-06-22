## [2.0.1](https://github.com/vorchdorf-dot-media/weather/compare/v2.0.0...v2.0.1) (2021-06-22)


### Bug Fixes

* **website:** fixed extreme station hyperlinks ([#7](https://github.com/vorchdorf-dot-media/weather/issues/7)) ([78ba987](https://github.com/vorchdorf-dot-media/weather/commit/78ba987535441625479e5dfb88ccd1f55c8c7980))

# [2.0.0](https://github.com/vorchdorf-dot-media/weather/compare/v1.1.1...v2.0.0) (2021-06-22)


### Bug Fixes

* **website:** fixed display of Breadcrumbs ([7d41dde](https://github.com/vorchdorf-dot-media/weather/commit/7d41dde9b9301473f4f75ba6a50bb68f47636fbd))
* **website:** fixed query on /stations/[name] page ([b37c4ed](https://github.com/vorchdorf-dot-media/weather/commit/b37c4edf2a87918019fa5f958871abc67b343e59))


### Features

* updated Postman collection ([41ae44f](https://github.com/vorchdorf-dot-media/weather/commit/41ae44fcbfff90f353216f0bddfd7125c67c1733))
* **functions:** removed ID from Station type ([a6ea369](https://github.com/vorchdorf-dot-media/weather/commit/a6ea36933c2583fad9026f8531dab26dbec071d3))
* **website:** switched from /stations/[id] to /stations/[name] ([8e59f1a](https://github.com/vorchdorf-dot-media/weather/commit/8e59f1ae73466500b456faa67e1a040b0997c7dc))


### BREAKING CHANGES

* **website:** To obscure the station ID, the station name is now used as URL path parameter
* **functions:** Queries for stations switched from ID to name field. ID is not selectable anymore, name is now the unique identifier.
