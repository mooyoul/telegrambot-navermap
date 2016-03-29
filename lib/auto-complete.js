'use strict';

/**
 * Module dependencies.
 */

const
  Promise       = require('bluebird'),
  debug         = require('debug'),
  request       = require('request'),
  _             = require('underscore');



const
  log           = debug('telegrambot-navermap:auto-complete');


const
  UNOFFICIAL_AUTOCOMPLETE_ENDPOINT = 'http://ac.map.naver.com/ac';

module.exports = exports = (query) => {
  return new Promise((resolve, reject) => {
    if (!query) {
      return reject(new Error('query is empty'));
    }

    request({
      method: 'GET',
      url: UNOFFICIAL_AUTOCOMPLETE_ENDPOINT,
      qs: {
        st: '10',
        r_lt: '10',
        ver: '4.2.0',
        caller: 'iPhone_NaverMap_4.2.0',
        r_format: 'json',
        frm: 'iphone',
        q_enc: 'UTF-8',
        r_enc: 'UTF-8',
        r_unicode: '0',
        t_koreng: '1',
        q: query
      },
      json: true
    }, (e, res, body) => {
      if (e) { return reject(e); }

      if (res.statusCode !== 200) {
        log('Unexpected status code, body: ', body);
        return reject(new Error(`Status code is not 200 (status: ${res.statusCode}, query: ${query})`));
      }


      if (!(body && body.items)) {
        log('Unexpected response. body: ', body);
        return reject(new Error(`Bad response from server`));
      }


      resolve(_.flatten(body.items));
    });
  });
};