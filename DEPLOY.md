# 服务器部署指南

本文档详细说明如何在 Linux 服务器上部署同济大学模拟联合国社团官方网站。

## 目录

- [前置要求](#前置要求)
- [环境配置](#环境配置)
- [应用搭建](#应用搭建)
- [PM2 进程管理](#pm2-进程管理)
- [一键部署](#一键部署)
- [常见问题](#常见问题)

## 前置要求

### 系统要求

- **操作系统**: Linux (Ubuntu 20.04+, CentOS 7+, 或其他主流发行版)
- **Node.js**: 18.x 或更高版本
- **PostgreSQL**: 12.x 或更高版本
- **内存**: 至少 2GB RAM
- **磁盘空间**: 至少 5GB 可用空间

### 必需软件

- Node.js 和 npm
- PostgreSQL 数据库
- Git
- PM2 (进程管理器)

## 环境配置

### 1. 安装 Node.js

#### Ubuntu/Debian

```bash
# 使用 NodeSource 仓库安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### CentOS/RHEL

```bash
# 使用 NodeSource 仓库安装 Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装 PostgreSQL

#### Ubuntu/Debian

```bash
# 安装 PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户并创建数据库
sudo -u postgres psql
```

#### CentOS/RHEL

```bash
# 安装 PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib

# 初始化数据库
sudo postgresql-setup initdb

# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户并创建数据库
sudo -u postgres psql
```

#### 创建数据库和用户

在 PostgreSQL 命令行中执行：

```sql
-- 创建数据库
CREATE DATABASE tjmun;

-- 创建用户（替换 'your_password' 为强密码）
CREATE USER tjmun_user WITH PASSWORD 'your_password';

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE tjmun TO tjmun_user;

-- 退出
\q
```

### 3. 安装 PM2

```bash
# 全局安装 PM2
sudo npm install -g pm2

# 验证安装
pm2 --version
```

### 4. 配置防火墙（如需要）

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 3000/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --reload
```

## 应用搭建

### 1. 获取项目代码

```bash
# 克隆项目或上传项目文件到服务器
cd /opt  # 或其他合适的目录
# 假设项目已上传到 /opt/tjmun_site_git
cd /opt/tjmun_site_git
```

### 2. 安装项目依赖

```bash
# 安装依赖
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env  # 如果有示例文件
# 或直接创建
nano .env
```

配置内容：

```env
# 数据库连接（替换为实际值）
DATABASE_URL="postgresql://tjmun_user:your_password@localhost:5432/tjmun?schema=public"

# NextAuth 配置
NEXTAUTH_URL="http://your-domain.com:3000"
# 或使用 IP
# NEXTAUTH_URL="http://your-server-ip:3000"

# 生成 NEXTAUTH_SECRET（在服务器上运行）
# openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-key-here"
```

**生成 NEXTAUTH_SECRET**：

```bash
openssl rand -base64 32
```

将生成的字符串复制到 `.env` 文件的 `NEXTAUTH_SECRET` 中。

### 4. 数据库迁移

```bash
# 运行数据库迁移
npm run prisma:migrate

# 生成 Prisma Client
npm run prisma:generate
```

### 5. 构建应用

```bash
# 构建生产版本
npm run build
```

### 6. 创建初始管理员账号

```bash
# 1. 先通过网站注册一个账号
# 访问 http://your-server-ip:3000/register

# 2. 使用脚本设置为管理员
npx tsx scripts/set-admin.ts your-email@example.com
```

## PM2 进程管理

### 启动应用

```bash
# 使用配置文件启动
pm2 start ecosystem.config.js

# 或直接启动
pm2 start npm --name "tjmun-website" -- start
```

### 常用 PM2 命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs tjmun-website

# 查看最近 50 行日志
pm2 logs tjmun-website --lines 50

# 重启应用
pm2 restart tjmun-website

# 停止应用
pm2 stop tjmun-website

# 删除应用
pm2 delete tjmun-website

# 监控应用（CPU、内存）
pm2 monit

# 查看详细信息
pm2 info tjmun-website

# 重新加载应用（零停机重启）
pm2 reload tjmun-website

# 保存当前进程列表
pm2 save
```

### 开机自启

```bash
# 生成启动脚本
pm2 startup

# 按照输出的提示执行命令（通常需要 sudo）
# 例如：
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-username --hp /home/your-username

# 保存当前进程列表
pm2 save
```

### 日志管理

日志文件位置：
- 标准输出: `logs/pm2-out.log`
- 错误日志: `logs/pm2-error.log`

```bash
# 查看实时日志
pm2 logs tjmun-website

# 清空日志
pm2 flush
```

## 一键部署

项目包含一键部署脚本 `deploy.sh`，可以自动完成所有部署步骤。

### 使用方法

```bash
# 1. 赋予执行权限
chmod +x deploy.sh

# 2. 编辑脚本中的配置（可选）
nano deploy.sh

# 3. 运行部署脚本
./deploy.sh
```

### 脚本功能

部署脚本会自动执行：

1. 检查系统要求（Node.js、PostgreSQL、PM2）
2. 安装缺失的依赖
3. 配置 PostgreSQL 数据库
4. 安装项目依赖
5. 配置环境变量（交互式）
6. 运行数据库迁移
7. 构建应用
8. 启动 PM2 服务
9. 配置开机自启

详细说明请查看 `deploy.sh` 脚本注释。

## 常见问题

### 1. 数据库连接失败

**问题**: `Error: P1001: Can't reach database server`

**解决方案**:
- 检查 PostgreSQL 服务是否运行: `sudo systemctl status postgresql`
- 检查数据库连接字符串是否正确
- 检查防火墙设置
- 检查 PostgreSQL 配置文件 `pg_hba.conf` 是否允许连接

### 2. 端口被占用

**问题**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 查找占用端口的进程
sudo lsof -i :3000
# 或
sudo netstat -tulpn | grep 3000

# 杀死进程或修改应用端口
```

### 3. PM2 应用无法启动

**问题**: 应用启动后立即退出

**解决方案**:
```bash
# 查看详细日志
pm2 logs tjmun-website --lines 100

# 检查环境变量
pm2 env 0

# 检查 Node.js 版本
node --version
```

### 4. 静态资源无法加载

**问题**: 图片、CSS 等资源 404

**解决方案**:
- 确保 `public` 目录存在
- 检查 Next.js 配置
- 重新构建应用: `npm run build`

### 5. 数据库迁移失败

**问题**: `Error: Migration failed`

**解决方案**:
```bash
# 重置数据库（谨慎使用，会删除所有数据）
npx prisma migrate reset

# 或手动检查迁移文件
npx prisma migrate status
```

### 6. 内存不足

**问题**: 应用运行缓慢或崩溃

**解决方案**:
- 增加服务器内存
- 优化 PM2 配置（减少实例数）
- 使用 swap 空间

```bash
# 创建 swap 文件（2GB）
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久启用
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 性能优化

### 1. 使用 Nginx 反向代理（推荐）

安装 Nginx：

```bash
# Ubuntu/Debian
sudo apt-get install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

配置 Nginx：

```nginx
# /etc/nginx/sites-available/tjmun
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/tjmun /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. 配置 HTTPS（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 备份策略

### 数据库备份

```bash
# 创建备份脚本
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U tjmun_user tjmun > $BACKUP_DIR/tjmun_$DATE.sql
# 保留最近 7 天的备份
find $BACKUP_DIR -name "tjmun_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup-db.sh

# 添加到 crontab（每天凌晨 2 点备份）
crontab -e
# 添加: 0 2 * * * /opt/backup-db.sh
```

### 文件备份

```bash
# 备份上传的文件
tar -czf /opt/backups/uploads_$(date +%Y%m%d).tar.gz /opt/tjmun_site_git/public/uploads
```

## 监控和维护

### 监控应用状态

```bash
# 设置 PM2 监控
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 定期更新

```bash
# 更新依赖
npm update

# 重新构建
npm run build

# 重启应用
pm2 restart tjmun-website
```

## 联系支持

如有问题，请查看项目 README 或联系技术支持。

