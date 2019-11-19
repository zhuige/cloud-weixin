// miniprogram/pages/playList/playList.js
const MAX_LIMIT = 15;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [
      {
        url:
          'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg'
      },
      {
        url:
          'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg'
      },
      {
        url:
          'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg'
      }
    ],
    playList: [],
    isNone: false
  },
  async test() {
    let arr = [];
    await wx.cloud
      .callFunction({
        name: 'getAllMusicList',
        data: {
          id: 3020182385
        }
      })
      .then(res => {
        let rearr = res.result.data[0].tracks;
        for (let i = 0; i < rearr.length; i++) {
          arr.push(rearr[i].id);
        }
      });
    console.log(arr);
    // for (let i = 0; i < arr.length; i++) {
    //   await wx.cloud
    //     .callFunction({
    //       name: 'getPlayList',
    //       data: {
    //         id: arr[i]
    //       }
    //     })
    //     .then(res => {
    //       console.log('成功');
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       console.log('数据库出错');
    //     });
    // }
  },
  _getList() {
    wx.showLoading({
      title: '加载中'
    });
    wx.cloud
      .callFunction({
        name: 'music',
        data: {
          $url: 'playList',
          start: this.data.playList.length,
          count: MAX_LIMIT
        }
      })
      .then(res => {
        if (res.result.data.length == 0) {
          this.setData({
            isNone: true
          });
        }
        this.setData({
          playList: this.data.playList.concat(res.result.data)
        });
        wx.stopPullDownRefresh();
        wx.hideLoading();
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      playList: [],
      isNone: false
    });
    this._getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    !this.data.isNone && this._getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
