// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

const rp = require('request-promise');
const URL = 'http://musicapi.xiecheng.live/playlist/detail?id=';

// 云函数入口函数
exports.main = async (event, context) => {
  const playList = await rp(URL + event.id).then(res => {
    return JSON.parse(res).playlist;
  });
  console.log(playList);
  await db
    .collection('musicList')
    .add({
      data: {
        ...playList
      }
    })
    .then(res => {
      console.log('插入成功');
    })
    .catch(err => {
      console.log(err);
      console.log('数据库失败');
    });
};
