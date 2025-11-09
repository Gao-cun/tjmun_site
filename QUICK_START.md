# 快速开始指南

## 前置要求

- Node.js 18+ 
- PostgreSQL 数据库
- npm 或 yarn

## 快速启动步骤

### 1. 克隆项目并安装依赖

```bash
cd /root/project/new_tjmun
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tjmun?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"
```

**生成 NEXTAUTH_SECRET**：
```bash
openssl rand -base64 32
```

### 3. 设置数据库

确保 PostgreSQL 正在运行，然后执行迁移：

```bash
npm run prisma:migrate
```

这将创建所有必要的数据库表。

### 4. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 5. 创建初始管理员账号

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:3000/register 注册一个账号

3. 打开 Prisma Studio 修改用户角色：
```bash
npm run prisma:studio
```

4. 在 Prisma Studio 中找到刚注册的用户，将 `role` 字段改为 `ADMIN`

或者使用 SQL：
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 6. 初始化网站配置（可选）

访问 http://localhost:3000/admin/settings 创建以下配置：

- `official_email`: 官方邮箱地址
- `wechat_qr_url`: 微信公众号二维码图片 URL

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产运行
npm run start

# 数据库迁移
npm run prisma:migrate

# 打开数据库可视化工具
npm run prisma:studio
```

## 测试流程

1. **注册账号** → http://localhost:3000/register
2. **登录** → http://localhost:3000/login
3. **创建会议**（管理员）→ http://localhost:3000/admin/conferences/new
4. **发布公告**（管理员）→ http://localhost:3000/admin/announcements/new
5. **报名会议**（学生）→ http://localhost:3000/conferences
6. **审核报名**（管理员）→ http://localhost:3000/admin/registrations

## 故障排除

### 数据库连接错误

检查：
- PostgreSQL 是否运行
- DATABASE_URL 是否正确
- 数据库是否存在

### Prisma 错误

```bash
# 重置数据库（谨慎使用，会删除所有数据）
npx prisma migrate reset

# 重新生成 Client
npm run prisma:generate
```

### NextAuth 错误

确保 `.env` 中的 `NEXTAUTH_SECRET` 已设置且足够长（至少 32 字符）。

## 下一步

- 阅读完整的 [README.md](./README.md)
- 配置生产环境部署
- 集成真实的支付系统
- 配置云存储（文件上传）

