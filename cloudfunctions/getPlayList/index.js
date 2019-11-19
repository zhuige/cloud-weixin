// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();

const rp = require("request-promise");
const URL = "http://musicapi.xiecheng.live/playlist/detail?id=";

// 云函数入口函数
exports.main = async (event, context) => {
  const playList = await rp(URL + event.id).then(res => {
    return JSON.parse(res).playlist;
  });
  console.log(playList);
  return await db.collection("musicList").add({
    data: {
      id: playList.id,
      _id: playList._id,
      coverImgUrl: playList.coverImgUrl,
      name: playList.name,
      description: playList.description,
      playCount: playList.playCount,
      shareCount: playList.shareCount,
      tracks: playList.tracks,
      createTime: db.serverDate()
    }
  });
};
