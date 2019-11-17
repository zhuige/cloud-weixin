// components/playList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playList: {
      type: Object
    }
  },

  observers: {
    ['playList.playCount'](count) {
      const res = this._tranNumber(count, 2);
      this.setData({
        _count: res
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tranNumber(num, point) {
      let numStr = num.toString().split('.')[0];
      //如果小于6位数字，证明是十万以内直接返回
      if (numStr.length < 6) return numStr;
      else if (numStr.length >= 6 && numStr.length <= 8) {
        let decimal = numStr.substring(
          numStr.length - 4,
          numStr.length - 4 + point
        );
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(
          numStr.length - 8,
          numStr.length - 4 + point
        );
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
      }
    }
  }
});
