## 项目记忆：short-video-ui

### 迁移来源
- 原 Codex 会话：`019f11cb-aad6-7661-8acb-bae1d17db383`
- 原会话标题：`确定抖音UI复刻方案`
- 原工作目录：`C:\Users\Dell\Documents\Codex\2026-06-29\w-q-o`
- 当前项目目录：`D:\Projects\short-video-ui`
- 原 Plan 模式最终方案已保存为当前项目的本地文件 `plan.md`，按用户要求不提交进 Git。
- 后续开发以 `D:\Projects\short-video-ui` 为准，不建议继续在旧的无项目目录中修改。

### 项目目标
- 做一个拍摄短片用的手机竖屏短视频 App UI 原型。
- 页面播放用户自己拍摄的视频，模拟演员刷短视频、点赞、打开评论区的镜头。
- 只需要 UI 和少量拍摄用交互，不做真实平台功能。

### 关键边界
- 不抓取、不反编译、不复用抖音 App 源码、官方图标、Logo 或私有资源。
- 采用 clean-room 自研 UI，追求拍摄镜头中的高相似。
- 单条视频页面，不做真实多视频流。
- 顶部只保留“精选 / 关注 / 推荐”，默认高亮“推荐”，不需要真正切换。
- 右侧按钮中只有点赞和评论需要交互，其余作为视觉元素。
- 评论区只做纯文字评论；不需要语音、语音转文字、图片评论、地点、AI 解析页签。
- “展开”“回复”“展开 N 条回复”等可以作为静态视觉文案，不需要真正展开。

### 当前实现
- 技术栈：React / Vite。
- 图标库：`lucide-react`，用于主页右侧互动按钮、顶部搜索、底部加号、评论区工具按钮、输入栏图标和展开箭头等；避免继续使用字符替代图标。
- 运行方式：PWA / 手机浏览器全屏访问。
- 主要页面：单条竖屏视频页。
- PWA：包含 `public/manifest.webmanifest` 和 `public/sw.js`。
- 内容配置集中在 `src/content.js`：
  - `video.src`
  - 作者头像和昵称
  - 简介、话题、搜索话题
  - 点赞、评论、收藏、分享数量
  - 弹幕文本、出现时间、轨道、速度
  - 评论列表
- 静态素材放在 `public/media/`。
- 默认视频路径为 `/media/main-video.mp4`，用户后续放入自己的视频即可。
- 默认视频文件位置为 `public/media/main-video.mp4`；如果文件名不同，需要同步修改 `src/content.js` 里的 `video.src`。
- 已按用户提供的同机抖音截图，对主页和评论区做过一轮视觉减重：
  - 右侧互动图标、顶部搜索、底部导航、播放按钮、作者名与简介字号已缩小，线条减细。
  - 评论区顶部、评论正文、头像、右侧点赞、输入栏和底部输入图标已缩小，避免“笨重/老人模式”观感。
  - “展开”和“展开 N 条回复”旁边的字符箭头已替换为 `ChevronDown` SVG，并用 `inline-flex` 对齐文字。

### 关键文件
- `plan.md`：原 Plan 模式确定的完整执行方案；本地参考文件，不提交进 Git。
- `src/content.js`：视频路径、作者名、头像、简介、话题、点赞数、评论数、评论内容、搜索话题、弹幕等主要内容配置。
- `src/main.jsx`：React 组件和交互逻辑。
- `src/styles.css`：页面视觉样式。
- `public/media/`：视频、头像等静态素材。
- `public/manifest.webmanifest`：PWA 配置。
- `public/sw.js`：基础 service worker。
- `README.md`：运行和替换素材说明。

### 常用命令
- `npm install`
- `npm run dev`
- `npm run build`

### 手机访问
- 本地开发地址通常是 `http://localhost:5173/` 或 `http://127.0.0.1:5173/`。
- 如果要让手机访问，需要电脑和手机在同一个 Wi-Fi 下，然后用 `npm run dev` 输出里的 Network 地址访问，例如 `http://电脑局域网IP:5173/`。

### 已验证状态
- 已执行 `npm install`。
- 已执行 `npm run dev`，开发服务启动成功。
- 旧会话中已完成主页与评论抽屉的浏览器视觉检查。
- 迁移到 `D:\Projects\short-video-ui` 后，已运行 `npm run build`，构建通过。
- 迁移后首次接手时当前目录还不是 Git 仓库；现已初始化为 Git 工程。
- 接入 `lucide-react` 并完成主页/评论区减重后，已再次运行 `npm run build`，构建通过。

### 本机注意事项
- 当前 Codex 沙箱里的 Windows PowerShell 可能无法启动，报 `CreateProcessAsUserW failed: 5`。
- 这属于工具链/沙箱执行环境问题，不代表项目文件缺失或损坏。
- 必要时可用提升权限执行只读检查或项目命令；修改文本文件仍优先使用 `apply_patch`。
- 如果 `apply_patch` 也被 Windows 沙箱 helper 拦截，可改用 .NET / Python 显式 UTF-8 写入，并在最终说明中区分这是工具链问题，不是资料本身不可用。
- npm 可能输出多条 `Unknown user config` warning，来自本机旧 npm 配置；目前不影响构建。

### 清理与 Git 状态
- 用户已归档并删除原无项目 Codex 对话。
- 用户已删除原无项目目录中的旧项目文件。
- 当前项目已经是唯一继续开发位置：`D:\Projects\short-video-ui`。
- 本轮已将当前项目初始化为 Git 工程，并创建首次提交作为迁移后的初始快照；`plan.md` 不纳入提交。
