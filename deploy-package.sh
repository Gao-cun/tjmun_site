#!/bin/bash

# =========================================================
# 一键部署脚本 - 在服务器上运行
# 用于解压和部署预构建的包
# =========================================================

set -e

APP_DIR="/project/tjmun_site"
PACKAGE_FILE="$1"

if [ -z "$PACKAGE_FILE" ]; then
  echo "❌ 错误：请指定包文件"
  echo "用法: $0 <package-file.tar.gz>"
  echo "示例: $0 /tmp/tjmun-website-20251111-101530.tar.gz"
  exit 1
fi

if [ ! -f "$PACKAGE_FILE" ]; then
  echo "❌ 错误：包文件不存在: $PACKAGE_FILE"
  exit 1
fi

echo "🚀 开始部署..."
echo "📍 目标目录：${APP_DIR}"
echo "📦 包文件：${PACKAGE_FILE}"

# 创建目标目录
mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

# 备份现有文件（如果存在）
if [ -d ".next" ]; then
  echo "📦 备份现有构建..."
  BACKUP_DIR=".next.backup.$(date +%Y%m%d-%H%M%S)"
  mv .next "${BACKUP_DIR}" 2>/dev/null || true
  echo "✅ 备份到: ${BACKUP_DIR}"
fi

# 解压包到临时目录
TEMP_EXTRACT="/tmp/tjmun-deploy-$(date +%s)"
mkdir -p "${TEMP_EXTRACT}"
echo "📦 解压部署包..."
tar -xzf "${PACKAGE_FILE}" -C "${TEMP_EXTRACT}"

# 复制文件到目标目录
echo "📋 复制文件..."
cp -r "${TEMP_EXTRACT}"/* "${APP_DIR}/" 2>/dev/null || true
cp -r "${TEMP_EXTRACT}"/.* "${APP_DIR}/" 2>/dev/null || true

# 清理临时目录
rm -rf "${TEMP_EXTRACT}"

# 安装生产依赖
if [ ! -d "node_modules/next" ]; then
  echo "📦 安装生产依赖..."
  npm install --production --no-audit --no-fund --legacy-peer-deps
else
  echo "✅ node_modules 已存在，跳过安装"
fi

# 生成 Prisma Client
if [ -d "prisma" ]; then
  echo "⚙️  生成 Prisma Client..."
  npx prisma generate
fi

# 创建必要的目录
mkdir -p logs
mkdir -p public/uploads

# 检查环境变量文件
if [ ! -f ".env" ]; then
  echo "⚠️  警告：.env 文件不存在"
  echo "请确保配置了正确的环境变量"
fi

# 创建或更新 ecosystem.config.js
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

# 验证构建文件
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ 错误：构建文件不存在，部署可能失败"
  exit 1
fi

echo "✅ 构建文件验证通过: $(cat .next/BUILD_ID)"

# 重启 PM2 服务
echo "🔄 重启 PM2 服务..."
pm2 delete tjmun-website 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ 部署完成！"
echo "🌐 访问地址：http://localhost:3000"
echo ""
echo "📊 服务状态："
pm2 status

echo ""
echo "📋 查看日志："
echo "  pm2 logs tjmun-website"

