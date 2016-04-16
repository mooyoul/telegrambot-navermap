'use strict';
/**
 * Module dependencies.
 */
const
  Promise   = require('bluebird'),
  debug     = require('debug'),
  mongoose  = require('mongoose'),
  User      = mongoose.model('User');


const
  log       = debug('telegrambot-navermap:command:start');


const
  findOrCreateUser = (from) => {
    return new Promise((resolve, reject) => {
      User.findOne({
        id: from.id
      }).exec((e, user) => {
        if (e) { return reject(e); }

        if (user) {
          return resolve(user);
        }

        User.create({
          id: from.id,
          firstName: from.first_name,
          lastName: from.last_name
        }, (e, user) => {
          if (e) { return reject(e); }

          resolve(user);
        })
      });
    });
  };

module.exports = exports = (bot) => {
  bot.onText(/\/start/, (message) => {
    findOrCreateUser(message.from).then(() => {
      bot.sendMessage(message.from.id, [
        '안녕하세요! 네이버 지도 봇은 인라인 봇으로, 원하시는 채팅방에서 `@NaverMapBot 검색어`를 입력하시면 사용하실 수 있습니다.',
        '',
        '*본 텔레그램 봇은 네이버에서 공식 서비스하는 봇이 아닙니다!*',
        '개발자 Telegram: @mooyoul',
        '개발자가 만든 좋은 변호사 찾는 로톡: https://www.lawtalk.co.kr/tg2',
        'RSS봇 Github: https://github.com/mooyoul/telegrambot-navermap'
      ].join('\n'), {
        parse_type: 'Markdown'
      });
    }).catch((e) => {
      log(e.stack);
      bot.sendMessage(message.from.id, '으앙! 서버에서 에러가 발생했습니다. 나중에 다시 시도해주세요. 불편을 끼쳐드려 죄송합니다 ㅠ_ㅠ');
    });
  });
};