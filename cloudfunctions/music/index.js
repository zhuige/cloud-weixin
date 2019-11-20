// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  app.router('playList', async (ctx, next) => {
    ctx.body = await cloud
      .database()
      .collection('playList')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res;
      });
  });
  app.router('musicList', async (ctx, next) => {
    ctx.body = await cloud
      .database()
      .collection('musicList')
      .where({
        id: parseInt(event.id)
      })
      .get()
      .then(res => {
        return res;
      });
  });
  //   app.router('musicUrl', async (ctx, next) => {
  //     ctx.body = await cloud
  //       .database()
  //       .collection('musicUrl')
  //       .where({
  //         id: parseInt(event.id),
  //         playListId: parseInt(event.playListId)
  //       })
  //       .get()
  //       .then(res => {
  //         return res;
  //       });
  //   });
  return app.serve();
};
