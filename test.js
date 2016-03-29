const
  autoComplete = require('./lib/auto-complete'),
  placeSearch = require('./lib/place-search');


//placeSearch('서울특별시 서초구 서초대로 287').then((places) => {
//  'use strict';
//  console.log(places);
//});



autoComplete('거').then((suggestions) => {
  'use strict';
  console.log(suggestions);
});