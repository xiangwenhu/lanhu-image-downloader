## 图片下载尺寸问题   
* p:为倍率
* slicescale: 是切图倍率，可以从接口获取，属性也是slicescale
* d.height&d.width: 切图的原始尺寸，通过 image-size 库获取获取
```js
"web" == o ? c.device.toLowerCase().indexOf("web") > -1 ? (m.width = Math.ceil(d.width / 2 * p),
        m.height = Math.ceil(d.height / 2 * p)) : (m.width = Math.ceil(d.width / c.slicescale * p),
        m.height = Math.ceil(d.height / c.slicescale * p)) : (m.width = Math.round(d.width / 4 * p),
        m.height = Math.round(d.height / 4 * p))


"web" == o ? c.device.toLowerCase().indexOf("web") > -1 ? (m.width = Math.ceil(d.width / 2 * p),
        m.height = Math.ceil(d.height / 2 * p)) : (m.width = Math.ceil(d.width / c.slicescale * p),
        m.height = Math.ceil(d.height / c.slicescale * p)) : (m.width = Math.round(d.width / 4 * p),
        m.height = Math.round(d.height / 4 * p))
```