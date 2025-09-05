# 在线题库系统

一个基于 Vue 3 + Express + MongoDB 的在线题库系统，支持题目浏览、搜索、收藏等功能。

## 功能特性

- 📚 题目分类浏览（爬虫基础、反爬虫、逆向工程等）
- 🔍 全文搜索功能
- ⭐ 题目收藏功能
- 📱 响应式设计，支持移动端
- 🚀 前后端分离架构
- 💾 MongoDB数据库存储
- 🔄 状态管理，避免页面重载问题

## 技术栈

### 前端
- Vue 3 + TypeScript
- Pinia 状态管理
- Vue Router 路由管理
- TDesign Vue Next UI组件库
- Vite 构建工具

### 后端
- Node.js + Express
- MongoDB + Mongoose
- CORS 跨域支持
- 限流和安全中间件

## 快速开始

### 环境要求

- Node.js >= 16
- MongoDB >= 4.4

### 安装依赖

```bash
# 安装前端和后端依赖
npm run setup
```

### 启动MongoDB

确保MongoDB服务正在运行：

```bash
# Windows
net start MongoDB

# macOS (使用Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 导入数据

```bash
# 导入题目数据到数据库
npm run server:seed
```

### 启动开发服务器

```bash
# 同时启动前端和后端开发服务器
npm run dev:full
```

或者分别启动：

```bash
# 启动后端服务器 (端口 3001)
npm run server:dev

# 启动前端开发服务器 (端口 5173)
npm run dev
```

### 访问应用

- 前端应用: http://localhost:5173
- 后端API: http://localhost:3001
- 健康检查: http://localhost:3001/health

## 项目结构

```
tiku_demo/
├── src/                    # 前端源码
│   ├── components/         # Vue组件
│   ├── views/             # 页面组件
│   ├── services/          # API服务
│   ├── stores/            # Pinia状态管理
│   ├── types/             # TypeScript类型定义
│   └── router/            # 路由配置
├── server/                # 后端源码
│   ├── controllers/       # 控制器
│   ├── models/           # 数据模型
│   ├── routes/           # 路由定义
│   ├── middleware/       # 中间件
│   ├── config/           # 配置文件
│   └── scripts/          # 脚本文件
├── data/                 # 题目数据文件
└── public/               # 静态资源
```

## API接口

### 题目相关

- `GET /api/questions` - 获取题目列表（支持分页和筛选）
- `GET /api/questions/:id` - 获取题目详情
- `GET /api/questions/search` - 搜索题目
- `GET /api/questions/categories` - 获取分类列表
- `GET /api/questions/stats` - 获取统计信息

### 请求参数

#### 获取题目列表
```
GET /api/questions?page=1&pageSize=20&category=爬虫基础&difficulty=easy&search=关键词
```

#### 搜索题目
```
GET /api/questions/search?q=关键词&page=1&pageSize=20
```

## 解决的问题

### 1. 详情页重载问题
- 使用 Pinia 状态管理缓存数据
- 监听路由参数变化而不是重新挂载组件
- 实现智能缓存机制

### 2. 搜索功能优化
- 后端使用 MongoDB 全文索引
- 前端状态管理避免重复请求
- URL参数同步搜索状态

### 3. 性能优化
- 数据缓存机制
- 分页加载
- 防抖搜索
- 组件懒加载

## 开发说明

### 环境变量

前端 `.env`:
```
VITE_API_URL=http://localhost:3001/api
```

后端 `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/tiku_db
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 数据格式

题目数据格式：
```json
{
  "question": "题目内容",
  "answer": "答案内容",
  "category": "分类",
  "difficulty": "easy|medium|hard",
  "tags": ["标签1", "标签2"]
}
```

## 部署

### 生产环境构建

```bash
# 构建前端
npm run build

# 启动后端生产服务器
cd server && npm start
```

### Docker部署

```dockerfile
# 可以创建 Dockerfile 进行容器化部署
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License