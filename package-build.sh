#!/bin/bash

# =========================================================
# 构建打包脚本 - 在资源充足的机器上运行
# 用于将构建产物打包，便于在目标服务器上快速部署
# =========================================================

set -e

APP_NAME="tjmun-website"
BUILD_DIR="$(pwd)"
PACKAGE_NAME="${APP_NAME}-$(date +%Y%m%d-%H%M%S).tar.gz"
TEMP_DIR="/tmp/${APP_NAME}-package"

echo "📦 开始打包 ${APP_NAME}..."
echo "📍 项目目录：${BUILD_DIR}"

# 1. 清理临时目录
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"

# 2. 构建项目（如果还没有构建）
if [ ! -f .next/BUILD_ID ]; then
  echo "🔨 开始构建项目..."
  export NODE_ENV=production
  npm run build
  
  if [ ! -f .next/BUILD_ID ]; then
    echo "❌ 构建失败"
    exit 1
  fi
  echo "✅ 构建成功"
else
  echo "✅ 构建已存在，跳过构建步骤"
fi

# 3. 生成 Prisma Client（如果需要）
echo "⚙️  生成 Prisma Client..."
npx prisma generate

# 4. 复制必要的文件到临时目录
echo "📋 复制文件到临时目录..."

# 构建产物
cp -r .next "${TEMP_DIR}/"
cp -r public "${TEMP_DIR}/" 2>/dev/null || true

# 必要的配置文件
cp package.json "${TEMP_DIR}/"
cp next.config.js "${TEMP_DIR}/"
cp tsconfig.json "${TEMP_DIR}/" 2>/dev/null || true
cp tailwind.config.ts "${TEMP_DIR}/" 2>/dev/null || true
cp postcss.config.js "${TEMP_DIR}/" 2>/dev/null || true

# Prisma 相关文件
cp -r prisma "${TEMP_DIR}/"
cp -r node_modules/.prisma "${TEMP_DIR}/node_modules-prisma" 2>/dev/null || true

# 创建生产依赖列表（精简打包不包含 node_modules，需要在服务器上安装）
echo "📝 创建部署说明..."
# 注意：精简打包不包含 node_modules，需要在服务器上运行 npm install --production

# 5. 创建部署脚本
cat > "${TEMP_DIR}/deploy-package.sh" <<'DEPLOY_SCRIPT'
#!/bin/bash

# 一键部署脚本
set -e

APP_DIR="/project/tjmun_site"
PACKAGE_FILE="$1"

if [ -z "$PACKAGE_FILE" ]; then
  echo "用法: $0 <package-file.tar.gz>"
  exit 1
fi

echo "🚀 开始部署..."
echo "📍 目标目录：${APP_DIR}"

# 创建目标目录
mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

# 备份现有文件（如果存在）
if [ -d ".next" ]; then
  echo "📦 备份现有构建..."
  BACKUP_DIR=".next.backup.$(date +%Y%m%d-%H%M%S)"
  mv .next "${BACKUP_DIR}" 2>/dev/null || true
fi

# 解压包
echo "📦 解压部署包..."
tar -xzf "${PACKAGE_FILE}" -C "${APP_DIR}"

# 安装生产依赖（精简打包不包含 node_modules）
echo "📦 安装生产依赖..."
npm install --production --no-audit --no-fund --legacy-peer-deps

# 生成 Prisma Client（如果需要）
if [ -d "prisma" ]; then
  echo "⚙️  生成 Prisma Client..."
  npx prisma generate
fi

# 创建必要的目录
mkdir -p logs
mkdir -p public/uploads

# 创建 ecosystem.config.js（如果不存在）
if [ ! -f "ecosystem.config.js" ]; then
  cat > ecosystem.config.js <<'EOF'
module.exports = {
  apps: [
    {
      name: 'tjmun-website',
      script: 'npm',
      args: 'start',
      cwd: '/project/tjmun_site',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=300',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '300M',
      kill_timeout: 5000,
      listen_timeout: 10000,
      log_type: 'json',
      pmx: true,
    },
  ],
}
EOF
fi

# 重启 PM2 服务
echo "🔄 重启 PM2 服务..."
pm2 delete tjmun-website 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "✅ 部署完成！"
echo "🌐 访问地址：http://localhost:3000"
pm2 status
DEPLOY_SCRIPT

chmod +x "${TEMP_DIR}/deploy-package.sh"

# 6. 创建 README
cat > "${TEMP_DIR}/README.md" <<'README'
# 部署包说明

此包包含已构建的 Next.js 应用，可以直接部署到生产服务器。

## 包含内容

- `.next/` - Next.js 构建产物
- `public/` - 静态文件
- `prisma/` - Prisma 配置和迁移文件
- `node_modules/` - 必要的生产依赖
- `package.json` - 项目配置
- `next.config.js` - Next.js 配置
- `deploy-package.sh` - 一键部署脚本

## 部署步骤

1. 将包文件传输到服务器
2. 运行部署脚本：
   ```bash
   bash deploy-package.sh package-file.tar.gz
   ```

## 环境要求

- Node.js 20+
- PM2
- PostgreSQL 数据库
- 环境变量文件 `.env`

## 注意事项

- 确保服务器上已安装 Node.js 和 PM2
- 确保数据库连接配置正确
- 部署前请备份现有数据
README

# 7. 打包
echo "📦 创建压缩包..."
cd "${TEMP_DIR}"
tar -czf "${BUILD_DIR}/${PACKAGE_NAME}" .

# 8. 清理临时目录
rm -rf "${TEMP_DIR}"

# 9. 显示结果
echo ""
echo "✅ 打包完成！"
echo "📦 包文件：${BUILD_DIR}/${PACKAGE_NAME}"
echo "📊 文件大小：$(du -h "${BUILD_DIR}/${PACKAGE_NAME}" | cut -f1)"
echo ""
echo "🚀 部署步骤："
echo "1. 将 ${PACKAGE_NAME} 传输到服务器"
echo "2. 在服务器上运行：bash deploy-package.sh ${PACKAGE_NAME}"

