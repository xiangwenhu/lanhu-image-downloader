
## API
### 1. 获取一个项目的所有图片（设计稿）信息

#### 方法说明
1. url: 
  `https://lanhuapp.com/api/project/images?project_id={project_id}&team_id={team_id}&dds_status=1&position=1&comment=1&show_cb_src=1`
1. 请求方式 GET

#### 参数说明
  * project_id    
    项目id
  * team_id    
    团队id


#### 示例结果
```js
{
  code: "0000",
  data: {
    has_next: false,
    id: "{uuid}",
    name: "名称",
    images:[{
      batch: "0",
      create_time: "Tue Feb 11 2025 15:52:45 GMT",
      dds_jump_status: 1,
      extra_attrs: "",
      group: [],
      has_comment: false,
      height: 100,
      home: false,
      id: "{uuid}",
      image_from: null,
      is_replaced: false,
      last_version_num: 7,
      latest_version: "{uuid}",
      layout_data: "",
      name: "设计稿名称",
      order: null,
      pinyinname: "z",
      position_x: 100,
      position_y: 100,
      positions: [],
      share_id: "{uuid}",
      sketch_id: "{uuid}",
      source: false,
      text_scale: null,
      trash_recovery: false,
      type: "image"
      update_time: "Tue Feb 11 2025 15:52:45 GMT",
      url: "{url}",
      user_id: "{uuid}",
      width: 100
    }]
  },
  msg: "Success"
}

```


## 2. 获取一个项目的分组信息
#### 方法说明
1. url:    
  `https://lanhuapp.com/api/project/project_sectors?project_id={project_id}`
1. 请求方式 GET

#### 参数说明
  * project_id    
    项目id


#### 示例结果
```js
{
  code: "0000",
  data: {
    sectors:[
      id: "{uuid}",
      images: ["{uuid}", "{uuid}"],
      name: "组名",
      order: 1,
      parent_id: null,
    ]
  },
  msg: "Success"
}

```

#### 说明
sectors的是分组， images是 id数组。
对应上一个接口的图片（设计稿）id



## 3. 获得一个图片（设计稿）的版本信息
#### 方法说明
1. url:    
  `https://lanhuapp.com/api/project/image?image_id=${image_id}&team_id=${team_id}&project_id=${project_id}&all_versions=0`
2. 请求方式 GET

#### 参数说明
  * project_id   
     项目id
  * team_id   
    团队id
  * image_id   
   设计稿的图片id
  * all_versions   
   是否获取全部版本


#### 示例结果
```js
{
  result: {
    "id": "{uuid}",
    "is_replaced": false,
    "last_version_num": 4,
    "lat": [],
    "layout_data": "",
    "name": "{name}",
    "url": "{url}",
    "versions": [
      {
            "comments": [],
            "create_time": "Tue Feb 11 2025 15:52:45 GMT",
            "d2c_url": null,
            "height": 100,
            "id": "{uuid}",
            "json_md5": null,
            "json_url": "{url}",
            "md5": null,
            "type": "image",
            "updated": true,
            "url": "{url}",
            "url_md5": null,
            "version_info": "\u7248\u672c5",
            "version_layout_data": null,
            "width": 100
        }
    ]
  },
  msg: "Success"
}

```

#### 说明
通常取最后的一个version，里面的`json_url`是关键，请求她可以获取设计稿每张图片的地址




## 4. 获得一个设计稿的所有切图地址
此地址，就是前面json_url的值
#### 方法说明
1. url:   
  `https://alipic.lanhuapp.com/{xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx}-{uiuid}`
1. 请求方式 GET

#### 参数说明
  无


#### 示例结果
```js
{
    "assets": [
        { "name": "关闭按钮", "id": 123456, "isAsset": true, "isSlice": true, "bounds": { "top": 100, "left": 100, "bottom": 600, "right": 600 }, "scaleType": "iOS @2x" },
        { "name": "头", "id": 123457, "isAsset": true, "isSlice": true, "bounds": { "top": 200, "left": 200, "bottom": 900, "right": 900 }, "scaleType": "iOS @2x" }
    ],
    "info": [
        {
            "id": 123456,
            "type": "layerSection",
            "name": "关闭按钮",
            "visible": true,
            "clipped": false,
            "blendOptions": { "mode": "passThrough" },
            "generatorSettings": false,
            "layers": [],
            "isAsset": true,
            "isSlice": true,
            "_orgBounds": { "top": 0, "left": 0, "bottom": 666, "right": 666 },
            "width": 666,
            "height": 666,
            "top": 0,
            "left": 0,
            "images": {
                "base": "iOS @2x",
                "svg": "{url}",
                "png_xxxhd": "{url}"
            },
            "realFrame": { "left": 0, "top": 0, "width": 0, "height": 0 },
            "ddsImages": { "orgUrl": "{url}", "base": "iOS @2x" },
            "hasExportDDSImage": true
        },
        ......
    ]
}

```

#### 说明

assets表示是有图片的，通过id去Info里面查找，找到对应ID的数据的`ddsImages.orgUrl`就是图片的下载地址


