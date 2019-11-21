// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

const rp = require('request-promise');
const URL = 'http://musicapi.xiecheng.live/playlist/detail?id=';
const URL2 = 'http://musicapi.xiecheng.live/song/url?id=';
const URL3 = 'http://musicapi.xiecheng.live/lyric?id=';
const MAX_LIMIT = 100;
const musicUrlCollection = db.collection('musicUrl');
// http://musicapi.xiecheng.live/song/url?id=
// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await musicUrlCollection.count();
  const total = countResult.total;
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const tasks = [];

  for (let i = 0; i < batchTimes; i++) {
    let promise = musicUrlCollection
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get();
    tasks.push(promise);
  }
  let list = [];
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return acc.data.concat(cur.data);
    });
  }
  return list;
};

// const playList = await rp(URL + event.id).then(res => {
//   return JSON.parse(res).playlist;
// });
//   const musicUrl = await rp(URL2 + event.id).then(res => {
//     return JSON.parse(res).data[0];
//   });
//   return await db.collection('musicUrl').add({
//     data: {
//       name: event.name,
//       playListName: event.playListName,
//       playListId: event.playListId,
//       id: musicUrl.id,
//       url: musicUrl.url,
//       size: musicUrl.size,
//       br: musicUrl.br,
//       md5: musicUrl.md5,
//       type: musicUrl.type
//     }
//   });
//   for (let j = 0, len = j + 5; j < 101; j = j + 5) {
//     if (101 - j < 5) {
//       len = 101;
//     }
//     for (let i = j; i < len; i++) {
//       const musicUrl = await rp(URL2 + playList.tracks[i].id).then(res => {
//         return JSON.parse(res).data[0];
//       });
//       await db.collection('musicUrl').add({
//         data: {
//           id: musicUrl.id,
//           url: musicUrl.url,
//           size: musicUrl.size
//         }
//       });
//     }
//   }
// return await db.collection('musicList').add({
//   data: {
//     id: playList.id,
//     _id: playList._id,
//     coverImgUrl: playList.coverImgUrl,
//     name: playList.name,
//     description: playList.description,
//     playCount: playList.playCount,
//     shareCount: playList.shareCount,
//     tracks: playList.tracks,
//     createTime: db.serverDate()
//   }
// });
