# 轻量化扫雷游戏 (Minesweeper)

一个使用TypeScript、HTML5 Canvas和CSS3开发的扫雷游戏，支持自定义棋盘、多语言切换和响应式设计。基于 H5 跨端解决方案开发，采用 MVC（Model-View-Controller）架构与面向对象设计方法，将游戏的逻辑、视图和控制分离，使项目结构清晰，便于维护和扩展。项目运用媒体查询技术，能够在桌面端浏览器、移动端浏览器及 WebView（iOS: WKWebView）中正常运行，实现多端无缝切换。同时，项目采用轻量化设计理念，尽可能减少乃至不采用第三方资源依赖，优化代码与资源加载，让项目资源消耗尽可能的小，在保证功能完整性的同时，提升游戏的加载速度与运行流畅度。此外，项目融入了语义化 HTML 设计，提升了游戏的可访问性和 SEO 效果。

## 🌟 项目特点

- ✅ **经典扫雷玩法**：完整实现传统扫雷游戏的所有核心功能
- ✅ **自定义游戏**：支持调整棋盘大小和地雷数量
- ✅ **响应式设计**：适配桌面和移动设备的流畅体验
- ✅ **多语言支持**：目前支持中文和英文
- ✅ **TypeScript**：使用强类型语言开发，确保代码质量
- ✅ **单元测试**：覆盖核心逻辑的完整测试用例
- ✅ **MVC架构**：模型-视图-控制器分离，代码结构清晰

## 🚀 快速开始

### 前提条件
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v10+)

### 项目结构
minesweeper/
├── public/                    # 存放favicon原始图
├── dist/                      # 生产构建输出目录
├── src/                       # 源代码目录
│   ├── index.ts                # 程序入口
│   ├── index.html             # 页面结构
│   ├── index.css              # 全局样式
│   ├── scripts/
│   │   ├── models/                 # 游戏模型层
│   │   │   ├── Cell.ts            # 单元格模型
│   │   │   └── MinesweeperModel.ts# 游戏核心逻辑
│   │   ├── views/                  # 视图渲染层
│   │   │   └── MinesweeperView.ts # Canvas视图
│   │   ├── controllers/            # 控制器层
│   │   │   └── MinesweeperController.ts # 事件处理
│   │   ├── utils/                 # 工具函数
│   │   │   ├── i18n.ts            # 国际化支持
│   │   │   └── canvasUtil.ts      # Canvas工具函数
│   └── locales/               # 多语言文案
│       ├── zh-CN.json         # 中文文案
│       └── en.json            # 英文文案
├── __tests__/                 # 单元测试目录
│   ├── models/                 # 模型测试
│   │   ├── Cell.test.ts       # 单元格测试
│   │   └── MinesweeperModel.test.ts # 游戏逻辑测试
│   ├── views/                  # 视图测试
│   │   └── MinesweeperCanvasView.test.ts # 渲染测试
│   ├── controllers/            # 控制器测试
│   │   └── MinesweeperController.test.ts # 交互测试
│   └── utils/                 # 工具类测试
│       └── i18n.test.ts       # 国际化测试
├── webpack/                   # Webpack配置目录
│   ├── webpack.common.js      # 公共配置
│   ├── webpack.dev.js         # 开发环境配置
│   └── webpack.prod.js        # 生产环境配置
├── .eslintrc.js               # ESLint配置
├── .gitignore                 # Git忽略规则
├── jest.config.js             # Jest单测驱动配置
├── package.json               # 项目依赖
├── pnpm-lock.yaml             # 包依赖锁配置
├── tsconfig.json              # TypeScript配置
└── README.md                  # 项目说明文档

### 安装与运行
```bash
# 克隆项目
git clone https://github.com/Zhangjianzy/minesweeper.git
cd minesweeper

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 执行单元测试
pnpm run test

# 发布打包
pnpm run build