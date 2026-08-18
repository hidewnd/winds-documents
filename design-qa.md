# Design QA

final result: passed

## 对照目标

- 视觉真值：`docs/design/reference-home-v2.png`
- 桌面实现：`C:/Users/Hidewnd/.codex/visualizations/2026/08/17/01a00ece-944a-73b1-aa70-7a620e732585/implementation-home-v2-light.png`
- 深色实现：`C:/Users/Hidewnd/.codex/visualizations/2026/08/17/01a00ece-944a-73b1-aa70-7a620e732585/implementation-home-v2-dark.png`
- 移动实现：`C:/Users/Hidewnd/.codex/visualizations/2026/08/17/01a00ece-944a-73b1-aa70-7a620e732585/implementation-home-v2-mobile.png`
- 组合对照：`C:/Users/Hidewnd/.codex/visualizations/2026/08/17/01a00ece-944a-73b1-aa70-7a620e732585/comparison-home-v2.png`
- 状态：浅色首页默认状态；另检查深色主题和移动端响应式状态。

## 视口与像素

- 源图：`1672 x 941`，72 DPI。
- 桌面 CSS 视口：`1672 x 941`，`deviceScaleFactor: 1`。
- 桌面实现：`1672 x 941`，未缩放、未裁切，无密度归一化。
- 移动 CSS 视口：`390 x 844`，`deviceScaleFactor: 1`。
- 移动实现：`390 x 844`，未缩放、未裁切。

## 全视图对照

实现保持了预览图的完整单屏结构：顶部大跨度半透明导航、左侧方形头像和品牌、居中胶囊搜索框、右侧横向导航、中部标题与短副标题、底部图标入口、版权信息，以及右下角独立主题按钮。生成的环境背景包含相同的冷白蓝灰光晕、细椭圆轨道、小型青色星点和右下克制的光谱折射。

源图和实现图按相同原生尺寸上下拼接检查，首屏比例、标题位置、页眉高度和页脚位置均没有可修复的 P0/P1/P2 偏差。

## 局部检查

没有额外裁切局部图：源图与实现图尺寸完全一致，导航、搜索、标题、页脚和主题按钮在全视图中均清晰可读。浏览器还对以下区域进行了实际测量：

- 导航框：`x=24, y=20, width=1624, height=70`。
- 首页标题区域：`x=651.19, y=370.91, width=369.61, height=141.69`。
- 页脚在首屏内可见。

## 五项视觉面检查

- 字体与排版：通过。浏览器确认 `HarmonyOS Sans SC` 已加载并成为 H1 的实际首选字体；标题、导航、搜索占位符和页脚文字没有错误回退或异常换行。
- 间距与布局：通过。桌面端保持 `24px` 页面边距和 `70px` 导航高度；标题与页脚构成稳定的单屏纵向平衡。移动端改为四层紧凑结构且无横向页面溢出。
- 颜色与令牌：通过。浅色主题使用旧 Vdoing 的 `#f4f4f4 / #004050 / #11A8CD / #0085AD` 体系；深色主题使用 `#27272B / #1E1E22 / #2C2C3A`。
- 图片与资产：通过。背景和头像均为独立 WebP 资产；没有用 CSS 绘画、占位图、手工 SVG 或文字字符模拟预览图中的视觉资产。图标来自构建期 Tabler/Iconify。
- 文案与内容：通过。首屏只保留 `Hidewnd Docs`、`竭风の档案`、`不被关注的小角落`、导航与真实站点链接；没有加入新的营销文案或虚构内容。

## 交互与运行证据

- Browser 插件不可用，使用 Playwright `1.62.1` + 本机 Chrome 回退验证。
- 首页标题：`Hidewnd Docs`；H1：`竭风の档案`。
- 页眉搜索 `SpringBoot` 后跳转 `/search/?q=SpringBoot`，显示 `找到 2 篇内容` 和 2 条结果。
- 主题按钮将 `html[data-theme]` 切换为 `dark`。
- 主题按钮同步更新为 `aria-pressed="true"`，状态可被辅助技术读取。
- 桌面和移动端均无文档级横向溢出。
- 移动端环境背景使用 `background-attachment: scroll`，避免移动 Safari 的固定背景性能问题。
- 桌面和移动端 Astro 开发工具栏元素数量均为 `0`。
- 最终桌面和移动端控制台无 error/warning/pageerror。

## 对照历史

### 第 1 轮

- [P2] 移动端版权文案保持单行时，末尾与右下主题按钮产生视觉挤压。

修复：

- 将页脚版权拆成语义分组，并在窄屏下分两行居中显示。

### 第 2 轮

- 重新捕获 `390 x 844` 移动端截图，版权信息完整可见。
- 没有剩余可操作的 P0、P1 或 P2 问题。

### 第 3 轮

- 独立审查确认字体文件是固定字重 `400` 而非可变字体；`@font-face` 已改为准确的 `font-weight: 400`。
- 主题按钮补充动态 `aria-pressed` 与随状态变化的中文 `aria-label`。
- 最终浏览器回归仍为 0 控制台错误、0 开发工具栏元素和 0 页面横向溢出。

## 可接受差异

- 源图标题略带宋体气质；实现遵循用户明确要求，统一使用 HarmonyOS Sans SC。
- 页脚写为 `Astro · Vdoing 配色`，不虚构当前项目使用了 Vdoing 主题。

---

## 文章阅读增强 QA

### 对照目标

- 代码块真值：`docs/design/reference-code-block.png`（`1600 x 1001`）。
- 文章阅读真值：`docs/design/reference-article-reading.png`（`3155 x 1911`）。
- 实现代码块：`C:/Users/Hidewnd/.codex/visualizations/2026/08/17/01a00ece-944a-73b1-aa70-7a620e732585/implementation-code-block.png`（`820 x 584`）。
- 实现桌面文章：`C:/Users/Hidewnd/.codex/visualizations/2026/08/17/01a00ece-944a-73b1-aa70-7a620e732585/implementation-article-reading.png`（CSS 视口与像素均为 `1600 x 1000`，DPR 1）。
- 实现移动文章：`C:/Users/Hidewnd/.codex/visualizations/2026/08/17/01a00ece-944a-73b1-aa70-7a620e732585/implementation-article-mobile.png`（CSS 视口与像素均为 `390 x 844`，DPR 1）。
- 组合对照：`comparison-code-block.png` 与 `comparison-article-reading.png`。

源图文章截图为不同像素密度和不同滚动位置，因此文章全视图按容器比例对照；代码块按完整块区域等比缩放后对照，没有用绝对像素差制造虚假精度。

### 视觉面检查

- 字体与排版：通过。`astro-expressive-code` 将代码字号设置为 `14px / 1.75`，小于桌面 `15px` 正文；移动端浏览器断言同样确认代码字号小于正文。行号与代码基线对齐。
- 间距与布局：通过。主阅读列从 `680px` 增加到 `820px`；桌面文章使用 `820px + 220px` 大纲的双列布局，移动端大纲自动移到正文之前。
- 颜色与令牌：通过。Shiki 根据 `bash/java/python/json/go` 等语言生成独立 token 色，首个 Shell 代码块实测包含 6 种计算后颜色；代码块采用参考图的浅灰底与对应深色主题。
- 图片与资产：通过。文章图片可使用完整 `820px` 阅读列；代码复制图标由 Expressive Code 提供，大纲和返回顶部图标来自 Tabler 图标集。
- 文案与内容：通过。大纲直接来自文章真实 H2/H3，没有生成或改写文章标题。

### 交互证据

- TDD 红灯初始确认缺少复制、行号、大纲、`800px` 以上阅读宽度和返回顶部按钮。
- 绿灯：`article reading features passed`。
- `/doc/d0003/` 共生成 21 个复制按钮；首个代码块有 21 条有效代码行号。
- Expressive Code 复制按钮将包含 `nginx` 的真实代码写入剪贴板，并通过内置 `aria-live` 宣告状态。
- `/vibe-coding/cursor/` 生成 6 条大纲链接，滚动后恰有 1 条 `aria-current="location"`。
- 长文滚动后返回顶部按钮显示，点击后平滑回到 `scrollY <= 16`。
- 桌面和移动端均无横向页面溢出，控制台无错误或警告。

### 对照历史

#### 第 1 轮

- [P2] Shiki 行节点间的纯空白与块级行布局叠加，造成代码行距过大。
- [P2] 定位代码块时，粘性导航会遮挡顶部复制按钮。

初步修复：保留原始文本用于复制，仅移除展示层空白节点；代码块增加 `118px` 的滚动避让距离。

#### 第 2 轮

- 代码块截图完整显示 1–22 行、复制按钮和圆角边框。
- 文章大纲、主阅读宽度与移动端布局没有剩余 P0/P1/P2 问题。

#### 第 3 轮

- [P1] 安全白名单移除了 Shiki 的内联 style，代码语言虽存在但最终没有关键字配色。
- [P1] 手工行号依赖 token span，在 JSON 等多 token 行上出现异常行距和断裂竖线。

修复：改用 `astro-expressive-code` + `@expressive-code/plugin-line-numbers`。专用依赖统一负责 Shiki 高亮、行号 gutter、复制按钮、无障碍反馈和明暗主题；站点仅保留语言归一化配置。

#### 第 4 轮

- Shell 围栏识别为 `bash`，代码块实测 6 种 token 颜色。
- 行号由插件 gutter API 按真实代码行生成，不再与 token DOM 耦合。
- 复制按钮默认可见；终端标题栏在视觉层隐藏，最终样式与参考图一致。
- TDD 与浏览器视觉回归再次通过，没有剩余 P0/P1/P2 问题。
