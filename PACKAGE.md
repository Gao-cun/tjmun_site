# 打包部署指南

## 在其他平台上构建打包

### 前置要求

- Node.js 20+
- npm 或 yarn
- 足够的内存（推荐 4GB+）

### 打包步骤

#### 方法1：精简打包（推荐）

```bash
# 1. 安装依赖
npm install

# 2. 运行打包脚本
bash package-build.sh
```

这会生成一个 `tjmun-website-YYYYMMDD-HHMMSS.tar.gz` 文件，包含：
- 构建产物 (.next/)
- 配置文件
- 部署脚本

**注意**：精简打包不包含 node_modules，部署时会在服务器上自动安装生产依赖。

#### 方法2：完整打包

```bash
# 运行完整打包脚本
bash package-full.sh
```

这会生成一个包含所有依赖的完整包，体积更大但部署更简单。

## 在服务器上部署

### 1. 传输文件

```bash
# 将打包文件和部署脚本传输到服务器
scp tjmun-website-*.tar.gz user@server:/tmp/
scp deploy-package.sh user@server:/tmp/
```

### 2. 部署

```bash
# SSH 登录服务器
ssh user@server

# 运行部署脚本
bash /tmp/deploy-package.sh /tmp/tjmun-website-*.tar.gz
```

部署脚本会自动：
- 解压包文件
- 安装生产依赖
- 生成 Prisma Client
- 配置 PM2
- 启动服务

## 环境变量配置

部署前确保服务器上有 `.env` 文件，包含：

```env
DATABASE_URL="postgresql://user:password@host:5432/tjmun?schema=public"
NEXTAUTH_URL="http://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"
```

## 故障排除

### 构建失败

- 确保 Node.js 版本正确（20+）
- 确保有足够的内存
- 检查网络连接（需要下载依赖）

### 部署失败

- 检查环境变量配置
- 检查数据库连接
- 检查 Node.js 版本
- 查看 PM2 日志：`pm2 logs tjmun-website`

## 优势

- ✅ 快速部署（1-2分钟 vs 30-60分钟）
- ✅ 资源节省（服务器不需要构建资源）
- ✅ 稳定性（在资源充足的机器上构建）
- ✅ 可重复（同一包可在多台服务器部署）

