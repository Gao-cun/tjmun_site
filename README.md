# 同济大学模拟联合国社团官方网站

基于 Next.js 14+ (App Router)、Prisma 和 PostgreSQL 构建的完整官方网站。

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI + 自定义组件
- **类型安全**: TypeScript

## 功能特性

### 公开功能
- 首页展示最新公告和近期会议
- 公告列表和详情页
- 会议列表和详情页
- 会议报名功能
- 联系我们页面（动态配置）
- 用户注册和登录

### 学生个人中心
- 查看所有报名记录
- 提交学术测试文件
- 在线缴费（模拟）

### 管理员后台
- 数据看板
- 用户管理（修改用户角色）
- 公告管理（CRUD）
- 会议管理（CRUD）
- **报名管理**（审核报名、查看学术测试、更新状态、确认缴费）
- 网站配置管理（官方邮箱、公众号二维码等）

## 项目结构

```
new_tjmun/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── admin/             # 管理员后台
│   ├── announcements/     # 公告页面
│   ├── conferences/       # 会议页面
│   ├── dashboard/        # 学生个人中心
│   ├── login/             # 登录页
│   ├── register/          # 注册页
│   └── contact/           # 联系我们
├── components/            # React 组件
│   ├── admin/             # 管理员组件
│   └── ui/                # UI 基础组件
├── lib/                   # 工具函数
│   ├── prisma.ts          # Prisma Client
│   └── auth.ts            # NextAuth 配置
├── prisma/                # Prisma 配置
│   └── schema.prisma      # 数据库模型
└── public/                # 静态文件
    └── uploads/           # 上传的文件
```

## 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/tjmun?schema=public"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# 可选：文件上传配置
# 当前使用本地存储，可配置为 Vercel Blob 或阿里云 OSS
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

确保 PostgreSQL 数据库已运行，并设置 `DATABASE_URL` 环境变量。

### 3. 运行数据库迁移

```bash
npm run prisma:migrate
```

这将创建所有必要的数据库表。

### 4. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 数据库初始化

首次运行后，建议创建初始管理员账号：

1. 通过注册页面创建一个账号
2. 使用脚本将该用户设置为管理员（推荐）：

```bash
npx tsx scripts/set-admin.ts your-email@example.com
```
更常用的
```bash
npx tsx scripts/set-admin.ts <邮箱地址>
```


或者使用 SQL 直接更新：
=======
2. 在数据库中手动将该用户的 `role` 字段更新为 `ADMIN`：

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-admin@email.com';
```

或者使用 Prisma Studio：

```bash
npm run prisma:studio
```

## 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run prisma:generate` - 生成 Prisma Client
- `npm run prisma:migrate` - 运行数据库迁移
- `npm run prisma:studio` - 打开 Prisma Studio（数据库可视化工具）

## 核心功能说明

### 报名审核流程

1. 学生报名会议
2. 如果会议需要学术测试，学生上传测试文件
3. 管理员在 `/admin/registrations` 查看所有报名
4. 管理员可以：
   - 查看学术测试文件
   - 将报名状态更新为：待审核/已通过/已拒绝/候补
   - 手动确认缴费状态（用于线下缴费）
5. 学生收到审核通过后可以缴费

### 文件上传

当前使用本地文件存储（`public/uploads/tests/`）。生产环境建议配置：
- Vercel Blob Storage
- 阿里云 OSS
- AWS S3

修改 `app/api/registrations/upload-test/route.ts` 以集成云存储。

### 支付集成

当前为模拟支付流程。生产环境需要集成：
- 支付宝
- 微信支付
- Stripe（国际）

修改 `app/api/registrations/[id]/payment/route.ts` 以集成真实支付。

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 运行数据库迁移

### 其他平台

项目可以部署到任何支持 Next.js 的平台：
- Vercel（推荐）
- Netlify
- Railway
- 自托管服务器

## 注意事项

1. **安全性**：
   - 确保 `NEXTAUTH_SECRET` 是强随机字符串
   - 生产环境使用 HTTPS
   - 配置 CORS 策略

2. **数据库**：
   - 定期备份数据库
   - 使用连接池管理数据库连接

3. **文件上传**：
   - 限制文件大小和类型
   - 扫描上传文件的安全性
   - 使用云存储而非本地存储

## 许可证

MIT

## 联系方式

如有问题，请通过网站联系我们页面联系。

