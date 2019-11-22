// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const rp = require("request-promise");
const db = cloud.database();
const URL = "http://musicapi.xiecheng.live/lyric?id="; //歌词

// 云函数入口函数
exports.main = async (event, context) => {
  let obj = await rp(URL + event.id).then(res => {
    return JSON.parse(res);
  });
  return await db.collection("musicLyric").add({
    data: {
      ...obj
    }
  });
};
