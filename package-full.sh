#!/bin/bash

# =========================================================
# 完整打包脚本 - 打包所有 node_modules（更大但更完整）
# 适用于需要完全离线部署的场景
# =========================================================

set -e

APP_NAME="tjmun-website"
BUILD_DIR="$(pwd)"
PACKAGE_NAME="${APP_NAME}-full-$(date +%Y%m%d-%H%M%S).tar.gz"
TEMP_DIR="/tmp/${APP_NAME}-package-full"

echo "📦 开始完整打包 ${APP_NAME}..."
echo "📍 项目目录：${BUILD_DIR}"

# 1. 清理临时目录
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"

# 2. 构建项目
if [ ! -f .next/BUILD_ID ]; then
  echo "🔨 开始构建项目..."
  export NODE_ENV=production
  npm run build
fi

# 3. 生成 Prisma Client
echo "⚙️  生成 Prisma Client..."
npx prisma generate

# 4. 复制所有文件
echo "📋 复制文件..."

# 构建产物和配置文件
cp -r .next "${TEMP_DIR}/"
cp -r public "${TEMP_DIR}/" 2>/dev/null || true
cp package.json "${TEMP_DIR}/"
cp package-lock.json "${TEMP_DIR}/" 2>/dev/null || true
cp next.config.js "${TEMP_DIR}/"
cp tsconfig.json "${TEMP_DIR}/" 2>/dev/null || true
cp tailwind.config.ts "${TEMP_DIR}/" 2>/dev/null || true
cp postcss.config.js "${TEMP_DIR}/" 2>/dev/null || true
cp -r prisma "${TEMP_DIR}/"

# 复制所有 node_modules（生产依赖）
echo "📦 复制所有生产依赖..."
npm install --production --no-audit --no-fund
cp -r node_modules "${TEMP_DIR}/"

# 5. 创建部署脚本
cat > "${TEMP_DIR}/deploy-package.sh" <<'DEPLOY_SCRIPT'
#!/bin/bash

set -e

APP_DIR="/project/tjmun_site"
PACKAGE_FILE="$1"

if [ -z "$PACKAGE_FILE" ]; then
  echo "用法: $0 <package-file.tar.gz>"
  exit 1
fi

echo "🚀 开始部署..."
echo "📍 目标目录：${APP_DIR}"

mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

# 备份
if [ -d ".next" ]; then
  BACKUP_DIR=".next.backup.$(date +%Y%m%d-%H%M%S)"
  mv .next "${BACKUP_DIR}" 2>/dev/null || true
fi

# 解压
echo "📦 解压部署包..."
tar -xzf "${PACKAGE_FILE}" -C "${APP_DIR}"

# 生成 Prisma Client
if [ -d "prisma" ]; then
  echo "⚙️  生成 Prisma Client..."
  npx prisma generate
fi

# 创建目录
mkdir -p logs
mkdir -p public/uploads

# 创建 ecosystem.config.js
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

# 重启服务
echo "🔄 重启 PM2 服务..."
pm2 delete tjmun-website 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "✅ 部署完成！"
pm2 status
DEPLOY_SCRIPT

chmod +x "${TEMP_DIR}/deploy-package.sh"

# 6. 打包
echo "📦 创建压缩包..."
cd "${TEMP_DIR}"
tar -czf "${BUILD_DIR}/${PACKAGE_NAME}" .

# 7. 清理
rm -rf "${TEMP_DIR}"

echo ""
echo "✅ 完整打包完成！"
echo "📦 包文件：${BUILD_DIR}/${PACKAGE_NAME}"
echo "📊 文件大小：$(du -h "${BUILD_DIR}/${PACKAGE_NAME}" | cut -f1)"

