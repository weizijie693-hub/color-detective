# 🎨 配色侦探 (Color Detective)

> 从任意图片中提取主色调，自动生成专业配色方案 —— 纯浏览器端处理，图片不上传服务器。

![Color Detective](https://img.shields.io/badge/AdventureX-2026-orange) ![License](https://img.shields.io/badge/license-MIT-blue) ![Pure Browser](https://img.shields.io/badge/processing-browser--side-green)

---

## ✨ 功能特性

- **智能色彩提取** — 基于 K-means++ 聚类算法，自动识别图片中的 5 种主色调
- **5 种配色方案** — 基于色彩理论自动生成：互补色、邻近色、三角色、分裂互补色、单色方案
- **拖拽上传** — 支持拖拽或点击上传 JPG / PNG / WebP 图片
- **一键复制** — 点击任意色块复制 Hex 值；右键复制 HSL 值
- **CSS 变量导出** — 一键生成 `:root` CSS 自定义属性
- **色卡导出** — 将主色调导出为 PNG 色卡图片
- **纯本地处理** — 所有计算在浏览器中完成，图片不会上传到任何服务器
- **Swiss Minimalism 设计** — 极简瑞士风格，专注内容

## 🚀 快速开始

1. 直接在浏览器中打开 `index.html`
2. 拖拽一张图片到页面，或点击上传区域选择图片
3. 自动加载演示图片，即刻体验

无需任何构建工具、依赖安装或后端服务。

## 🧠 技术原理

### K-means++ 颜色聚类

```
像素采样 → K-means++ 初始化质心 → 迭代聚类 → 按占比排序
```

1. **像素采样** — 从图片中智能采样最多 8000 个像素，跳过透明、极黑、极白像素
2. **K-means++ 初始化** — 使用加权概率分布选取初始质心，保证聚类收敛质量
3. **迭代聚类** — 加权色彩距离（人眼对绿色更敏感），最多 30 轮迭代
4. **结果排序** — 按簇大小降序排列，主色优先

### 配色方案生成

基于主色调的 HSL 值，通过色环角度变换生成：

| 方案 | 原理 | 角度偏移 |
|------|------|---------|
| 互补 | 色环对侧 | +180° |
| 邻近 | 色环相邻 | ±30° |
| 三角 | 三等分 | +120°, +240° |
| 分裂互补 | 互补色两侧 | +150°, +210° |
| 单色 | 同色相调明度 | 5 种明度变体 |

## 📁 项目结构

```
color-detective/
├── index.html            # 主页面
├── css/
│   └── style.css         # 样式（Swiss Minimalism）
├── js/
│   ├── main.js           # 入口 & 流程控制
│   ├── pixel-sampler.js  # 像素采样器
│   ├── kmeans.js         # K-means++ 聚类引擎
│   ├── palette.js        # 配色方案生成器（HSL 色彩理论）
│   ├── uploader.js       # 拖拽 & 点击上传
│   ├── ui.js             # 渲染引擎
│   └── export.js         # 导出（PNG / CSS / 复制）
└── README.md
```

## 🎯 使用技巧

- **点击色块** → 复制 Hex 色值
- **右键色块** → 复制 HSL 色值  
- **点击配色方案条** → 复制该方案所有色值
- **悬停色块** → 查看颜色占比
- 使用 **重新上传** 按钮更换图片

## 🛠️ 浏览器兼容性

支持所有现代浏览器：Chrome / Firefox / Safari / Edge。需要 Canvas API 支持。

## 📄 License

MIT — 自由使用，欢迎贡献。

---

<p align="center"><i>Made for AdventureX 2026 Hackathon</i></p>
