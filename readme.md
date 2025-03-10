## 这是啥
下载蓝湖设计稿的切图到本地, just 省点力气。
* 支持下载整个项目
* 支持下载某个组
* 支持下载某个设计稿
* 支持中文转英文命名
* 支持下载1倍图或者2倍图
* 支持下载后调整尺寸


## 蓝湖结构
* team 团队
  * project 项目
    * group 组
      * image 图片（设计稿）（包干多个切图）
        * slice 切图


## 流程 & 图
API参数[api.md](./docs/api.md)
1. 获取一个项目的所有图片（设计稿）信息
2. 获取一个项目的所有图片（设计稿）分组信息
3. 通过1,2能知道某个分组的所有图片（设计稿）信息
4. 通过API获得某个图片（设计稿）的所有版本
5. 最新的版本有一个json_url字段，通过该字段获取所有资源信息
6. 挨个下载资源
7. 默认2倍图，如果需要一倍图，获取尺寸，缩减尺寸
8. 图片压缩

TODO:: 流程图


## 第三方库
1. 获取图片大小
   https://www.npmjs.com/package/image-size
```js
const sizeOf = require('image-size')
sizeOf('images/funny-cats.png', function (err, dimensions) {
  console.log(dimensions.width, dimensions.height)
})

```

2. 重置图片大小
https://www.npmjs.com/package/sharp
```js
sharp(inputBuffer)
  .resize(320, 240)
  .toFile('output.webp', (err, info) => { ... });

```

## 蓝湖插件支持
目前蓝湖设计图转代码已支持 Sketch、PS、Figma、MasterGo 四款插件

## TODO
- [x] 封装蓝湖处理部分 (2025-02-12)
- [x] 组名为未分组的特殊处理 (2025-02-12)
- [x] 地址反向解析, 通过地址识别是单个 设计稿|组|项目 (2025-02-15)
- [x] 下载源头就选择1倍 或者 2倍 (2025-02-15) (无需此操作)
- [x] isMergeData模式导致多下载图片的问题 (V1修复版本)
  判断父是否可以导出 + layer-group的特殊判断  （2025-03-05）
- [x] 下载的图片与蓝湖显示的尺寸大小不一样的问题，目前分析是蓝湖web端做了处理 （2025-03-04）
  下载图片后，按照尺寸调整图片大小（sharp）
- [x] 图片下载格式选择（png, jpg, webp）(2025-03-09)
- [ ] 平台（IOS, Android, Web）
- [ ] 兼容：MasterJSON格式数据 (2025-03-10)
- [ ] 兼容：Figma (暂无此设计搞)
- [ ] 图片下载格式选择 svg
- [ ] 瘦身
- [ ] 完善日志
- [ ] 打包发布
