'use strict';

/**
 * Module dependencies.
 */

const
  Promise       = require('bluebird'),
  debug         = require('debug'),
  request       = require('request'),
  sanitizeHtml  = require('sanitize-html'),
  qs            = require('querystring'),
  _             = require('underscore');



const
  log           = debug('telegrambot-navermap:place-search');


const
  PLACE_INFO = {
    ENDPOINT: 'http://map.naver.com/local/siteview.nhn',
    METHOD: 'GET',
    PARAMS: {}
  },
  APP_LINK = {
    ENDPOINT: 'http://map.naver.com/',
    METHOD: 'GET',
    PARAMS: {
      version: 10,
      app: 'Y',
      appMenu: 'location',
      pinType: 'site'
      }
  },
  UNOFFICIAL_PLACE_SEARCH = {
    ENDPOINT: 'http://map.naver.com/search2/local.nhn',
    METHOD: 'GET',
    PARAMS: {}
  };



module.exports = exports = (query) => {
  return new Promise((resolve, reject) => {
    if (!query) {
      return reject(new Error('query is empty'));
    }

    request({
      url: UNOFFICIAL_PLACE_SEARCH.ENDPOINT,
      method: UNOFFICIAL_PLACE_SEARCH.METHOD,
      qs: {
        query: query
      },
      json: true
    }, (e, res, body) => {
      if (e) { return reject(e); }

      if (res.statusCode !== 200) {
        log('Unexpected status code, body: ', body);
        return reject(new Error(`Status code is not 200 (status: ${res.statusCode}, query: ${query})`));
      }


      if (!(body && body.result && body.result.code === '0')) {
        if (body.result && body.result.type === 'NO_RESULT') { return resolve([]); }

        log('Unexpected response code. body: ', body);
        return reject(new Error(`Bad response from server (code: ${body.code})`));
      }


      let addresses = (body.result.address || {list: []}).list.map((place) => {
        return {
          title: sanitizeHtml(place.name, {allowedTags: []}),
          address: sanitizeHtml(place.fullAddress, {allowedTags: []}),
          coords: {
            x: place['x'],
            y: place['y'],
            type: 'EPSG:4326'
          },
          appLink: `${APP_LINK.ENDPOINT}?${qs.stringify(_.extend({
            pinId: place.id.substr(1),
            lat: place['y'],
            lng: place['x'],
            title: sanitizeHtml(place.name, {allowedTags: []})
          }, APP_LINK.PARAMS))}`
        }
      });

      let places = (body.result.site || {list: []}).list.map((place) => {
        return {
          title: sanitizeHtml(place.name, {allowedTags: []}),
          description: place.description ? sanitizeHtml(place.description, {allowedTags: []}) : null,
          address: sanitizeHtml(place.address || place.fullAddress, {allowedTags: []}),
          telephone: place['tel'] || null,
          coords: {
            x: place['x'],
            y: place['y'],
            type: 'EPSG:4326'
          },
          thumb: place.thumUrl,
          link: `${PLACE_INFO.ENDPOINT}?${qs.stringify({code: place.id.substr(1)})}`,
          appLink: `${APP_LINK.ENDPOINT}?${qs.stringify(_.extend({
            pinId: place.id.substr(1),
            lat: place['y'],
            lng: place['x'],
            title: sanitizeHtml(place.name, {allowedTags: []})
          }, APP_LINK.PARAMS))}`
        };
      });


      resolve(_.union(places, addresses));
    });
  });
};