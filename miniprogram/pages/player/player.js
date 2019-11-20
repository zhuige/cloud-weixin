// pages/player/player.js

//获取musicList整个数组
let musicList = [];
// 获取播放歌曲index
let nowPlayingIndex = '';
//获取全局背景音频  wx.getBackgroundAudioManager()
const backgroundAudioManger = wx.getBackgroundAudioManager();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, //false不播放  true 正在播放,
    isMove: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let playListId = options.playListId;
    this.setData({
      isPlaying: false
    });
    nowPlayingIndex = options.index;
    musicList = wx.getStorageSync('musicList' + playListId).musicList;
    this._loadMusicDetail(300);
  },
  _loadMusicDetail(num) {
    this.setMoveTrue(num);
    let music = musicList[nowPlayingIndex];
    wx.setNavigationBarTitle({
      title: music.name
    });
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: true
    });
    let src =
      'https://music.163.com/song/media/outer/url?id=' + music.id + '.mp3';
    //背景音乐对象需要的src和title
    if (!(backgroundAudioManger.src == src)) {
      backgroundAudioManger.src = src;
      backgroundAudioManger.title = music.name;
      backgroundAudioManger.coverImgUrl = music.al.picUrl;
      backgroundAudioManger.singer = music.ar[0].name;
      backgroundAudioManger.epname = music.al.name;
    } else {
      backgroundAudioManger.play();
    }
  },
  togglePlaying() {
    //正在播放
    if (this.data.isPlaying) {
      backgroundAudioManger.pause();
    } else {
      backgroundAudioManger.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying,
      isMove: !this.data.isMove
    });
  },
  onPrev() {
    nowPlayingIndex--;
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musicList.length - 1;
    }
    this.setMoveFalse();
    if (this.data.isPlaying) this._loadMusicDetail(500);
    else this._loadMusicDetail(0);
  },
  onNext() {
    nowPlayingIndex++;
    if (nowPlayingIndex == musicList.length) {
      nowPlayingIndex = 0;
    }
    this.setMoveFalse();
    if (this.data.isPlaying) this._loadMusicDetail(500);
    else this._loadMusicDetail(0);
  },
  setMoveTrue(time) {
    setTimeout(() => {
      this.setData({
        isMove: true
      });
    }, time);
  },
  setMoveFalse() {
    this.setData({
      isMove: false
    });
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
