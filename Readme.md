# metalsmith-cloudinary

[![npm version][version-badge]][version-url]
[![dependency status][dependency-badge]][dependency-url]
[![devdependency status][devdependency-badge]][devdependency-url]
[![downloads][downloads-badge]][downloads-url]

> A metalsmith plugin for retrieving data from the Cloudinary api

[![stack overflow][stackoverflow-badge]][stackoverflow-url]
[![slack chat][slack-badge]][slack-url]

[Cloudinary](http://cloudinary.com/) is a CDN that allows you to upload images and apply transformations when retrieving them. This is immensely useful when working with responsive images, because now you no longer have to process images during your build process.

Just add [parameters](http://cloudinary.com/documentation/image_transformations) to your images' url, and Cloudinary will supply the image at the correct dimensions via their CDN. I recommend [cloudinate](https://github.com/superwolff/cloudinate) to automate the uploading of your images to Cloudinary. That being said, Cloudinary accepts all kinds of files, so this plugin and cloudinate can of course be used for all kinds of other purposes as well.

For support questions please use [stack overflow][stackoverflow-url] or our [slack channel][slack-url]. For questions about Cloudinary try the aforementioned channels, as well as their [documentation](http://cloudinary.com/documentation/). Specifically the [list resources](http://cloudinary.com/documentation/admin_api#list_resources) part of the [admin api](http://cloudinary.com/documentation/admin_api), which is what this plugin provides access to.

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

metalsmith-cloudinary will query the Cloudinary api and store the results in the global [metadata](https://github.com/metalsmith/metalsmith#metadata-api) under `cloudinary`, indexed by your assets' `public_id`. The contents will of course differ depending on what you've uploaded, but will resemble:

```javascript
// images/1 is the public_id
'images/1': {
  "format": "jpg",
  "version": 1333013579,
  "resource_type": "image",
  "type": "upload",
  "created_at": "2012-03-29T09:32:59Z",
  "bytes": 128891,
  "width": 283,
  "height": 424,
  "url": "http://res.cloudinary.com/demo/image/upload/v1333013579/1.jpg",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1333013579/1.jpg"
},
// images/2 is the public_id
'images/2': {
  "format": "jpg",
  "version": 1333013579,
  "resource_type": "image",
  "type": "upload",
  "created_at": "2012-03-29T09:32:59Z",
  "bytes": 128891,
  "width": 283,
  "height": 424,
  "url": "http://res.cloudinary.com/demo/image/upload/v1333013579/2.jpg",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1333013579/2.jpg"
},
```

Which means that in your templates you could use (with something like [swig](https://paularmstrong.github.io/swig/) and [metalsmith-in-place](https://github.com/superwolff/metalsmith-in-place)):

```swig
{{ cloudinary['images/1'].secure_url }}
{{! would be rendered to: https://res.cloudinary.com/demo/image/upload/v1333013579/1.jpg }}
```

## Options

You can pass options to `metalsmith-cloudinary` with the [Javascript API](https://github.com/segmentio/metalsmith#api) or [CLI](https://github.com/segmentio/metalsmith#cli). The options are:

* [cloud_name](#credentials): your cloud name (required)
* [api_key](#credentials): your api key (required)
* [api_secret](#credentials): your api secret (required)
* [params](#params): an optional object of parameters to pass to the cloudinary api (optional)
* ttl: ms to retain cache, false to disable cache, default: (60 * 60 * 1000) / 500 (optional)

### credentials

Your [Cloudinary API credentials](http://cloudinary.com/documentation/api_and_access_identifiers#access_identifiers). So this `metalsmith.json`:

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

Would retrieve all files you've uploaded to Cloudinary and store them in your `metadata`.

### params

An object of [optional parameters](http://cloudinary.com/documentation/admin_api#list_resources) to pass to the Cloudinary API. By default the `max_results` option is set to the maximum (500). So this `metalsmith.json`:

```json
{
  "plugins": {
    "metalsmith-cloudinary": {
      "cloud_name": "your_cloud_name_here",
      "api_key": "your_api_key_here",
      "api_secret": "your_api_secret_here",
      "params": {
        "max_results": 10
      }
    }
  }
}
```

Would retrieve 10 results at maximum and store them in your `metadata`.

## build & test

`npm run babel:node6` to build
`npm run test` or `npm run test:watch` for tests, no global dependencies required

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
