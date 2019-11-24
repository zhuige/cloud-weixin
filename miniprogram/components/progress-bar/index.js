// components/progress-bar/index.js
let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentSec = -1; //当前秒数
let duration = 0; //当前歌曲的总时长
let isMoving = false; //锁 移动的时候状态
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },

  lifetimes: {
    ready() {
      if (typeof backgroundAudioManager.duration != 'undefined') {
        this._setTime();
      } else {
        setTimeout(() => {
          this._setTime();
        }, 1000);
      }
      this._getMovableDisWidth();
      this._bindBGMEvent();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      if (event.detail.source == 'touch') {
        this.data.progress =
          (event.detail.x / (movableAreaWidth - movableViewWidth)) * 100;
        this.data.movableDis = event.detail.x;
        isMoving = true;
      }
    },
    onTouchEnd() {
      backgroundAudioManager.seek((duration * this.data.progress) / 100);
      const currentTimeFmt = this._dataFormat(
        Math.floor(backgroundAudioManager.currentTime)
      );
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      });
      isMoving = false;
    },

    _getMovableDisWidth() {
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec(rect => {
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
      });
    },

    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false;
        this.triggerEvent('musicPlay');
      });
      backgroundAudioManager.onPause(() => {
        this.triggerEvent('musicPause');
      });
      backgroundAudioManager.onStop(() => {});
      backgroundAudioManager.onWaiting(() => {});

      backgroundAudioManager.onCanplay(() => {});
      backgroundAudioManager.onTimeUpdate(() => {
        if (isMoving) return;
        const currentTime = backgroundAudioManager.currentTime;
        const duration = backgroundAudioManager.duration;
        const sec = currentTime.toString().split('.')[0];
        if (sec != currentSec) {
          const currentTimeFmt = this._dataFormat(currentTime);
          this.setData({
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
            movableDis:
              ((movableAreaWidth - movableViewWidth) * currentTime) / duration,
            progress: (currentTime / duration) * 100
          });
        } else {
          currentSec = sec;
        }
      });
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd');
      });
      backgroundAudioManager.onError(() => {});
    },
    _setTime() {
      duration = backgroundAudioManager.duration;
      const durationFmt = this._dataFormat(duration);
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      });
    },
    // 格式化时间
    _dataFormat(sec) {
      const min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      return {
        min: this._parse0(min),
        sec: this._parse0(sec)
      };
    },
    // 补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec;
    }
  }
});
