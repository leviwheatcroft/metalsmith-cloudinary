import plugin from '../lib/index.js'
import cloudinary from 'cloudinary'
import nock from 'nock'
import config from 'config'
import debug from 'debug'
import { join } from 'path'
import { assert } from 'chai'
import Metalsmith from 'metalsmith'
import sinon from 'sinon'

import { readFileSync } from 'fs'
const dbg = debug('metalsmith-cloudinary')
const auth = config.get('metalsmithCloudinary')

// nock.recorder.rec()
function getFix(src) {
  let buffer = readFileSync(join('test/fixtures', src))
  return JSON.parse(buffer.toString('utf8'))
}
function setFix(value, src) {
  writeFileSync(join('test/fixtures', src), JSON.stringify(value))
}

describe('metalsmith-cloudinary', () => {
  nock('https://api.cloudinary.com:443') //, {"encodedQueryParams":true})
  .get(/\/v1_1\/.*\/resources\/image/)
  .query({"max_results":"500"})
  .times(12)
  .reply(200, {"resources":[{"public_id":"sample","format":"jpg","version":1478558380,"resource_type":"image","type":"upload","created_at":"2016-11-07T22:39:40Z","bytes":109669,"width":864,"height":576,"url":"http://res.cloudinary.com/whtcr/image/upload/v1478558380/sample.jpg","secure_url":"https://res.cloudinary.com/whtcr/image/upload/v1478558380/sample.jpg"}]}, [ 'Cache-Control',
  'max-age=0, private, must-revalidate',
  'Content-Type',
  'application/json; charset=utf-8',
  'Date',
  'Thu, 26 Jan 2017 06:23:21 GMT',
  'ETag',
  '"91f8018f56b75bcafe36a8e8ea761fdd"',
  'Server',
  'cloudinary',
  'Status',
  '200 OK',
  'X-FeatureRateLimit-Limit',
  '500',
  'X-FeatureRateLimit-Remaining',
  '499',
  'X-FeatureRateLimit-Reset',
  'Thu, 26 Jan 2017 07:00:00 GMT',
  'X-Request-Id',
  'c294a52ceb9138ad',
  'X-UA-Compatible',
  'IE=Edge,chrome=1',
  'transfer-encoding',
  'chunked',
  'Connection',
  'Close' ])

  it('dlToMeta: should be able to download file info to meta', (done) => {
    Metalsmith('test/fixtures/dlToMeta')
    .use(plugin(auth))
    .use((files, ms, next) => {
      assert.deepEqual(
        getFix('dlToMeta/meta.json'),
        ms.metadata().cloudinary,
        'meta is as expected'
      )
      next()
    })
    .build((err, files) => {
      if (err) return done(err)
      done()
    })
  })
  it('useCache: should be able to retrieve resources from cache', (done) => {
    // create spy
    sinon.spy(cloudinary.api, 'resources')
    Metalsmith('test/fixtures/useCache')
    .use(plugin(auth))
    .use(plugin(auth))
    .use((files, ms, next) => {
      assert.isAtMost(
        cloudinary.api.resources.callCount,
        1,
        'api has not been called for subsequent reads'
      )
      assert.deepEqual(
        getFix('useCache/meta.json'),
        ms.metadata().cloudinary,
        'meta is as expected'
      )
      next()
    })
    .build((err, files) => {
      if (err) return done(err)
      done()
    })
  })
  it('noCache: should be able to forego cache', (done) => {
    // reset spy
    cloudinary.api.resources.reset()
    Metalsmith('test/fixtures/useCache')
    .use(plugin(Object.assign({ ttl: false }, auth)))
    .use(plugin(Object.assign({ ttl: false }, auth)))
    .use((files, ms, next) => {
      assert.isAtLeast(
        cloudinary.api.resources.callCount,
        2,
        'api has been called for subsequent reads'
      )
      assert.deepEqual(
        getFix('noCache/meta.json'),
        ms.metadata().cloudinary,
        'meta is as expected'
      )
      next()
    })
    .build((err, files) => {
      if (err) return done(err)
      done()
    })
  })
})
