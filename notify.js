'use strict';

/**
 * Module dependencies.
 */

const
  Promise         = require('bluebird'),
  path            = require('path'),
  mongoose        = require('mongoose'),
  autoIncrement   = require('mongoose-auto-increment'),
  debug           = require('debug'),
  dotenv          = require('dotenv'),
  requireDir      = require('require-dir'),
  _               = require('underscore'),
  TelegramBot     = require('node-telegram-bot-api');

/**
 * Application specific configurations.
 */
debug.enable('telegrambot-navermap:notify');

const
  log               = debug('telegrambot-navermap:notify'),
  env               = process.env;

dotenv.load({
  path: path.join(__dirname, '.env')
});

_.defaults(env, {
  NODE_ENV: 'development',
  PORT: 9000
});

const
  message = [
    '*[공지]*',
    '안녕하세요 여러분, 개발자 Presott 입니다.',
    '업데이트 내역이 있어서 이렇게 메세지로 찾아뵙게 되었습니다!',
    '',
    '*4/17 업데이트 내역*',
    '- 주소검색시 네이버 지도 링크가 작동하지 않는 버그 수정',
    '주소검색 결과의 \'네이버 지도 앱에서 열기\' 링크 클릭시 네이버 지도 앱에서 "검색된 결과가 없습니다" 라는 결과를 출력하는 버그를 수정하였습니다.',
    '',
    '- 광고 추가 (또르르...)',
    '이제 메세지 본문에 한 줄 광고가 포함됩니다.',
    '매달 AWS에 서버 사용료를 지불하고 있지만, 사비를 들이다 보니 부담이 가는 실정입니다.',
    '그래서 부득이하게 광고를 추가하게 되었습니다 T.T',
    '광고는 오직 개발자가 만든 서비스를 소개하는 용도로만 발송되며, 제3자의 광고는 나가지 않습니다.',
    '불편하신 분들께서는 아래 Github 프로젝트를 방문하시어 광고가 없는 네이버지도 봇을 직접 운영하실 수도 있습니다',
    '',
    '- 오픈소스 프로젝트로 공개',
    '이제 네이버 지도 봇이 오픈소스 프로젝트로 공개되었습니다.',
    '프로젝트에 star를 쏘아주세요! Contribute도 환영입니다! :)',
    '[Github 저장소 바로가기](https://github.com/mooyoul/telegrambot-navermap)',
    '',
    '혹시라도 사용 도중 기능이 제대로 동작하지 않거나 불편하신 사항이 있으시다면 [@mooyoul](https://telegram.me/mooyoul) 계정으로 메세지를 남겨주시면 감사하겠습니다.',
    '[친구추가 바로가기](https://telegram.me/mooyoul)',
    '그럼, 즐거운 주말 되세요. 감사합니다!'
  ].join('\n');


/**
 * Creates an Application.
 */
const db      = mongoose.connect(process.env.MONGO_URL, { options: { db: { safe: true } } }, (e) => {
  if (e) throw e;

  log('Connected to mongodb.');

  mongoose.set('debug', process.env.NODE_ENV === "development");
  autoIncrement.initialize(db);

  // Bootstrap models
  requireDir('./models');
  log('Bootstrapped models.');

  const
    bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
      webHook: false,
      polling: false
    });

  log('Created bot. Getting Users...');

  // Bootstrap commands
  const User = mongoose.model('User');

  User.find()
  .exec((e, users) => {
    log('Fetched %d users', users.length);

    Promise.map(users.map((user) => user.id), (id) => {
      return bot.sendMessage(id, message, {
        parse_mode: 'Markdown'
      }).then(() => {
        return Promise.resolve(true);
      }).catch((e) => {
        console.error(e);
        return Promise.resolve(false);
      });
    }, {concurrency: 10}).then((results) => {
      log('sent: %d, failed: %d', results.filter((x) => x).length, results.filter((x) => !x).length);
      process.exit(0);
    });
  });
});