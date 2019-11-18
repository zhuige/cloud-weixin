// components/musicList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      const id = e.currentTarget.dataset.musicid;
      this.setData({
        playingId: id
      });
      wx.navigateTo({
        url: '../../pages/player/player?musicId=' + id
      });
    }
  }
});
