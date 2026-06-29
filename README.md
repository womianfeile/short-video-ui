# 短视频拍摄 UI

这是一个用于短片拍摄的高相似短视频 App 道具界面。项目不包含也不复用任何抖音源码、官方图标或私有资源。

## 运行

```bash
npm install
npm run dev
```

默认地址：

```text
http://127.0.0.1:5173
```

手机和电脑在同一个 Wi-Fi 下时，可以用电脑局域网 IP 访问，例如：

```text
http://你的电脑IP:5173
```

手机浏览器打开后，可以添加到桌面，以 PWA 方式启动。

## 替换内容

主要内容都在 `src/content.js`：

- `video.src`：主视频路径，默认是 `asset("media/main-video.mp4")`
- `profile.avatar`、`profile.name`：头像和作者名
- `description.text`、`description.tags`：底部简介和话题
- `counts`：点赞、评论、收藏、分享数量
- `searchTopic`：评论区“大家都在搜”后面的词
- `danmaku.items`：弹幕文案、出现时间、轨道和速度
- `comments`：评论头像、昵称、正文、时间、点赞数、回复提示

静态素材放在 `public/media/`。例如，把你拍好的视频放到：

```text
public/media/main-video.mp4
```

如果文件名不同，就同步修改 `src/content.js` 里的 `video.src`，例如 `asset("media/your-video.mp4")`。

## 构建

```bash
npm run build
```

构建产物在 `dist/`。

## GitHub Pages

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。
