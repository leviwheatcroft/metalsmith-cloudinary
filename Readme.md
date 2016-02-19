# metalsmith-cloudinary

[![npm version][version-badge]][version-url]
[![dependency status][dependency-badge]][dependency-url]
[![devdependency status][devdependency-badge]][devdependency-url]
[![downloads][downloads-badge]][downloads-url]

> A metalsmith plugin for retrieving data from the cloudinary api

[![stack overflow][stackoverflow-badge]][stackoverflow-url]
[![slack chat][slack-badge]][slack-url]

This plugin allows you to render templating syntax in your source files. You can use any templating engine supported by [consolidate.js](https://github.com/tj/consolidate.js#supported-template-engines). For support questions please use [stack overflow][stackoverflow-url] or our [slack channel][slack-url]. For questions about cloudinary try the aforementioned channels, as well as their [documentation](http://cloudinary.com/documentation/). Specifically the part concerning the [admin api](http://cloudinary.com/documentation/admin_api), which is what this plugin provides access to.

## Installation

```
$ npm install metalsmith-cloudinary
```

## Example

Configuration in `metalsmith.json`:

```json
{
  "plugins": {
    "metalsmith-cloudinary": {
      "cloud_name": "your_cloud_name_here",
      "api_key": "your_api_key_here",
      "api_secret": "your_api_secret_here",
    }
  }
}
```

metalsmith-cloudinary will query the Cloudinary api and store the results in the metadata under `cloudinary`, indexed by public id.

## Options

You can pass options to `metalsmith-cloudinary` with the [Javascript API](https://github.com/segmentio/metalsmith#api) or [CLI](https://github.com/segmentio/metalsmith#cli). The options are:

* cloud_name: your cloud name (required)
* api_key: your api key (required)
* api_secret: your api secret (required)
* params: an optional object of parameters to pass to the cloudinary api (optional)

## License

MIT

[dependency-badge]: https://david-dm.org/superwolff/metalsmith-cloudinary.svg
[dependency-url]: https://david-dm.org/superwolff/metalsmith-cloudinary
[devdependency-badge]: https://david-dm.org/superwolff/metalsmith-cloudinary/dev-status.svg
[devdependency-url]: https://david-dm.org/superwolff/metalsmith-cloudinary#info=devDependencies
[downloads-badge]: https://img.shields.io/npm/dm/metalsmith-cloudinary.svg
[downloads-url]: https://www.npmjs.com/package/metalsmith-cloudinary
[slack-badge]: https://img.shields.io/badge/Slack-Join%20Chat%20→-blue.svg
[slack-url]: http://metalsmith-slack.herokuapp.com/
[stackoverflow-badge]: https://img.shields.io/badge/stack%20overflow-%23metalsmith-red.svg
[stackoverflow-url]: http://stackoverflow.com/questions/tagged/metalsmith
[version-badge]: https://img.shields.io/npm/v/metalsmith-cloudinary.svg
[version-url]: https://www.npmjs.com/package/metalsmith-cloudinary
