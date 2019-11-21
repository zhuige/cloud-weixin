// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
const URL = 'http://musicapi.xiecheng.live/lyric?id='; //歌词
const MAX_LIMIT = 100;
// 云函数入口函数
exports.main = async (event, context) => {
  return await db
    .collection('musicUrl')
    .get()
    .then(res => {
      return res;
    });
};
