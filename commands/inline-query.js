
'use strict';

/**
 * Module dependencies.
 */

const
  mongoose      = require('mongoose'),
  debug         = require('debug'),
  _             = require('underscore'),
  placeSearch   = require('../lib/place-search'),
  Message       = mongoose.model('Message'),
  Query         = mongoose.model('Query'),
  Choice        = mongoose.model('Choice');

const
  log       = debug('telegrambot-navermap:inline-query');

module.exports = exports = (bot) => {
  bot.on('inline_query', (msg) => {
    log('Got query: ', msg);



    if (!msg.query) {
      return bot.answerInlineQuery(msg.id, []);
    }


    placeSearch(msg.query).then((places) => {
      const
        inlineQueryResults = places.map((place, index) => {
          const payload = {
            type: 'article',
            id: `${msg.id}/${index}`,
            title: place.title,
            description: place.description || place.address,
            url: place.link || place.appLink,
            disable_web_page_preview: true,
            message_text: _.chain([
                `<strong>[네이버 지도] ${place.title}</strong>`,
                place.telephone,
                place.address,
                place.description,
                '\n',
                place.link && `<a href="${place.link}">상세정보 바로가기</a>`,
                place.appLink && `<a href="${place.appLink}">네이버 지도 앱에서 열기</a>`
              ]).compact()
              .value()
              .join('\n'),
            parse_mode: 'HTML'
          };

          if (place.thumb) { payload.thumb_url = place.thumb; }

          return payload;
        });

      bot.answerInlineQuery(msg.id, inlineQueryResults, {
        cache_time: 86400
      });
    }).catch((e) => {
      log(e.stack);

      bot.answerInlineQuery(msg.id, [], {
        cache_time: 0
      });
    });

    Query.create(msg, (e) => {
      if (e) {
        log(e.stack ? e.stack : e);
      }
    });
  });

  bot.on('chosen_inline_result', (msg) => {
    Choice.create(msg).exec((e) => {
      if (e) {
        log(e.stack ? e.stack : e);
      }
    });
  });
};