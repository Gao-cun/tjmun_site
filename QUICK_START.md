# 快速开始

## 在其他平台上构建打包

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件
```

### 3. 构建和打包

```bash
# 精简打包（推荐）
bash package-build.sh

# 或完整打包
bash package-full.sh
```

### 4. 部署到服务器

```bash
# 传输文件
scp tjmun-website-*.tar.gz user@server:/tmp/
scp deploy-package.sh user@server:/tmp/

# 在服务器上部署
ssh user@server
bash /tmp/deploy-package.sh /tmp/tjmun-website-*.tar.gz
```

## 详细文档

- `README.md` - 项目说明
- `PACKAGE.md` - 打包部署详细指南
- `BUILD.md` - 构建说明
