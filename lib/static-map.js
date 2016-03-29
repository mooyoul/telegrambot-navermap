'use strict';

/**
 * Module dependencies.
 */

const
  Promise       = require('bluebird'),
  debug         = require('debug'),
  url           = require('url'),
  qs            = require('querystring'),
  _             = require('underscore');



const
  log           = debug('telegrambot-navermap:place-search');


const STATIC_MAP = {
  ENDPOINT: 'http://openapi.naver.com/map/getStaticMap',
  METHOD: 'GET',
  HEADERS: {
    Referer: process.env.NAVER_MAP_IDENTIFIER
  },
  PARAMS: {
    version: '1.1',
      key: process.env['HUBOT_NAVER_MAP_KEY'],
      uri: url.parse(process.env.NAVER_MAP_IDENTIFIER).host,
      level: 11,
      crs: 'NHN:128',
      exception: 'inimage',
      w: 640,
      h: 640,
      baselayer: 'default',
      maptype: 'default',
      format: 'png'
  }
};





module.exports = exports = (x, y, coordType) => {
  if(!(x && y)) {
    return '';
  }

  return STATIC_MAP.ENDPOINT +
    '?' +
    qs.stringify(_.defaults({
      center: x + ',' + y,
      markers: x + ',' + y,
      crs: coordType || STATIC_MAP.PARAMS.crs
    }, STATIC_MAP.PARAMS));
};