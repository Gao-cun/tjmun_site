# 项目信息

## 项目概述

这是 `tjmun_site` 项目的清理版本，专门用于在其他平台上进行构建打包。

## 已清理的内容

✅ **构建产物**
- `.next/` - Next.js 构建目录
- `node_modules/` - 依赖包（需要重新安装）

✅ **临时文件**
- `logs/*.log` - 日志文件
- `.next.backup.*` - 备份文件
- `*.tmp` - 临时文件

✅ **敏感信息**
- `.env` - 环境变量文件（已删除，请使用 `.env.example`）

✅ **上传文件**
- `public/uploads/tests/*` - 测试上传的文件

✅ **冗余文档**
- `INSTALL.md` - 安装文档（已整合到 README）
- `PROJECT_STRUCTURE.md` - 项目结构文档（已整合）
- `QUICK_START.md` - 快速开始（已重新创建）
- `README_PACKAGE.md` - 打包说明（已整合到 PACKAGE.md）
- `PACKAGE_DEPLOY.md` - 部署文档（已整合到 PACKAGE.md）

✅ **临时脚本**
- `fix-deploy.sh` - 修复部署脚本
- `build-low-memory.sh` - 低内存构建脚本
- `deploy.sh` - 完整部署脚本（包含构建）

## 保留的核心文件

### 源代码
- `app/` - Next.js 应用代码
- `components/` - React 组件
- `lib/` - 工具函数
- `prisma/` - 数据库模型
- `public/` - 静态文件
- `scripts/` - 工具脚本
- `types/` - TypeScript 类型定义

### 配置文件
- `package.json` - 项目配置
- `next.config.js` - Next.js 配置
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.ts` - Tailwind 配置
- `ecosystem.config.js` - PM2 配置
- `.env.example` - 环境变量示例
- `.gitignore` - Git 忽略文件
- `.dockerignore` - Docker 忽略文件

### 打包脚本
- `package-build.sh` - 精简打包脚本
- `package-full.sh` - 完整打包脚本
- `deploy-package.sh` - 部署脚本

### 文档
- `README.md` - 项目说明
- `PACKAGE.md` - 打包部署指南
- `BUILD.md` - 构建说明
- `QUICK_START.md` - 快速开始
- `PROJECT_INFO.md` - 本文件

## 项目大小

- 源代码：约 2.1MB
- 文件数：120 个
- 目录数：73 个

## 使用场景

此项目适合：
1. ✅ 在其他平台上构建（CI/CD、本地开发机等）
2. ✅ 打包后传输到服务器部署
3. ✅ 版本控制和代码管理
4. ✅ 团队协作开发

## 下一步

1. 在其他平台上安装依赖：`npm install`
2. 配置环境变量：`cp .env.example .env`
3. 构建和打包：`bash package-build.sh`
4. 部署到服务器：使用 `deploy-package.sh`

## 注意事项

- 部署前确保服务器上有正确的 `.env` 文件
- 部署时可能需要修改 `ecosystem.config.js` 中的路径
- 确保数据库已创建并运行迁移
