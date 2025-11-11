# 构建打包说明

## 项目结构

这是一个干净的 Next.js 项目副本，已移除所有构建产物和临时文件，适合在其他平台上进行打包。

## 文件说明

### 核心文件
- `package.json` - 项目依赖和脚本
- `next.config.js` - Next.js 配置
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.ts` - Tailwind CSS 配置
- `prisma/schema.prisma` - 数据库模型定义

### 打包脚本
- `package-build.sh` - 精简打包脚本（推荐）
- `package-full.sh` - 完整打包脚本
- `deploy-package.sh` - 部署脚本

### 配置文件
- `ecosystem.config.js` - PM2 配置
- `.env.example` - 环境变量示例
- `.gitignore` - Git 忽略文件

## 使用步骤

### 1. 在其他平台上

```bash
# 克隆或复制项目
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入正确的配置

# 构建和打包
bash package-build.sh
```

### 2. 在服务器上部署

```bash
# 传输打包文件
scp tjmun-website-*.tar.gz user@server:/tmp/
scp deploy-package.sh user@server:/tmp/

# 部署
ssh user@server
bash /tmp/deploy-package.sh /tmp/tjmun-website-*.tar.gz
```

## 注意事项

1. **环境变量**：部署前确保服务器上有正确的 `.env` 文件
2. **数据库**：确保数据库已创建并运行迁移
3. **Node.js 版本**：需要 Node.js 20+
4. **路径配置**：部署后可能需要修改 `ecosystem.config.js` 中的路径

## 清理说明

以下文件/目录已被清理：
- ✅ `.next/` - 构建产物（会在构建时生成）
- ✅ `node_modules/` - 依赖包（需要重新安装）
- ✅ `logs/` - 日志文件
- ✅ `public/uploads/` - 上传的文件
- ✅ `.env` - 环境变量（已删除，请使用 `.env.example`）
- ✅ 临时文档和脚本文件

## 文件大小

项目当前大小：约 2MB（不包含 node_modules）

打包后大小：
- 精简包：约 10-20MB
- 完整包：约 100-200MB

