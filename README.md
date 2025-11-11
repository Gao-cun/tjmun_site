# 同济模联官网

基于 Next.js 14+ (App Router)、Prisma 和 PostgreSQL 构建的官方网站。

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI
- **类型安全**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tjmun?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. 运行数据库迁移

```bash
npm run prisma:migrate
```

### 4. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 5. 启动开发服务器

```bash
npm run dev
```

## 打包部署

### 在其他平台上构建打包

```bash
# 精简打包（推荐）
bash package-build.sh

# 完整打包（包含所有依赖）
bash package-full.sh
```

### 在服务器上部署

```bash
# 将打包文件和部署脚本传输到服务器后
bash deploy-package.sh package-file.tar.gz
```

## 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run prisma:generate` - 生成 Prisma Client
- `npm run prisma:migrate` - 运行数据库迁移
- `npm run prisma:studio` - 打开 Prisma Studio

## 项目结构

```
tjmun_site_bag/
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
├── lib/                    # 工具函数
├── prisma/                 # Prisma 配置
├── public/                 # 静态文件
├── scripts/                # 工具脚本
└── types/                  # TypeScript 类型定义
```

## 环境要求

- Node.js 20+
- PostgreSQL 数据库
- npm 或 yarn

## 许可证

MIT
