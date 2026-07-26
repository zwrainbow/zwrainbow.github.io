// docs/js/live2d-init.js
L2Dwidget.init({
  "model": {
    "jsonPath": "/live2d/snow_miku/model.json"
  },
  "display": {
    "position": "left",      // 注意：这行可能被忽略，但保留无妨
    "width": 300,
    "height": 450,
    "hOffset": 0,
    "vOffset": 0
  },
  "mobile": { "show": false },
  "react": { "opacity": 0.8 }
});


setTimeout(function() {
  var widget = document.getElementById('live2d-widget');
  if (widget) {
    widget.style.left = '20px';        // 左下角
    widget.style.right = 'auto';       // 取消右侧定位
    widget.style.bottom = '30px';      // 离底部30px
    widget.style.width = '200px';      // 宽度
    widget.style.height = '300px';     // 高度
  }
}, 500); 