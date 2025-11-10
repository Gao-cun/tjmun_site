# 项目结构说明

## 目录结构

```
new_tjmun/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── auth/                 # 认证相关
│   │   │   ├── [...nextauth]/   # NextAuth 路由
│   │   │   └── register/        # 注册 API
│   │   ├── admin/               # 管理员 API
│   │   │   ├── announcements/   # 公告管理
│   │   │   ├── conferences/     # 会议管理
│   │   │   ├── registrations/   # 报名管理
│   │   │   ├── settings/        # 配置管理
│   │   │   └── users/           # 用户管理
│   │   └── registrations/       # 报名相关 API
│   │       └── upload-test/     # 文件上传
│   ├── admin/                    # 管理员后台页面
│   │   ├── dashboard/           # 数据看板
│   │   ├── users/               # 用户管理
│   │   ├── announcements/       # 公告管理
│   │   ├── conferences/            # 会议管理
│   │   ├── registrations/       # 报名管理（核心）
│   │   └── settings/            # 网站配置
│   ├── announcements/            # 公告页面
│   │   └── [id]/                # 公告详情
│   ├── conferences/              # 会议页面
│   │   └── [slug]/              # 会议详情
│   ├── dashboard/                # 学生个人中心
│   ├── login/                    # 登录页
│   ├── register/                 # 注册页
│   ├── contact/                  # 联系我们
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/                   # React 组件
│   ├── admin/                    # 管理员组件
│   │   ├── announcement-form.tsx
│   │   ├── conference-form.tsx
│   │   ├── registration-actions.tsx
│   │   ├── site-config-form.tsx
│   │   ├── update-user-role-button.tsx
│   │   └── new-site-config-form.tsx
│   ├── ui/                       # UI 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── textarea.tsx
│   ├── file-upload-form.tsx      # 文件上传组件
│   ├── payment-button.tsx         # 缴费按钮
│   ├── register-button.tsx        # 报名按钮
│   ├── navbar.tsx                 # 导航栏
│   ├── footer.tsx                 # 页脚
│   └── providers.tsx             # 上下文提供者
├── lib/                          # 工具库
│   ├── prisma.ts                 # Prisma Client 实例
│   ├── auth.ts                   # NextAuth 配置
│   └── utils.ts                  # 工具函数
├── prisma/                       # Prisma 配置
│   └── schema.prisma             # 数据库模型定义
├── public/                       # 静态文件
│   └── uploads/                  # 上传的文件存储
├── types/                        # TypeScript 类型定义
│   └── next-auth.d.ts            # NextAuth 类型扩展
├── middleware.ts                 # Next.js 中间件（路由保护）
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── next.config.js                # Next.js 配置
└── README.md                     # 项目文档
```

## 核心文件说明

### 数据库模型 (prisma/schema.prisma)

- **User**: 用户模型（学生/管理员）
- **Announcement**: 公告模型
- **Conference**: 会议模型
- **Registration**: 报名模型（核心）
- **SiteConfig**: 网站配置模型
- **Account, Session, VerificationToken**: NextAuth 标准模型

### 认证系统

- `lib/auth.ts`: NextAuth 配置
- `app/api/auth/[...nextauth]/route.ts`: NextAuth 路由
- `middleware.ts`: 路由保护中间件

### 核心功能页面

1. **公开页面**
   - `app/page.tsx`: 首页
   - `app/announcements/`: 公告列表和详情
   - `app/conferences/`: 会议列表和详情
   - `app/contact/`: 联系我们

2. **学生功能**
   - `app/dashboard/`: 个人中心
   - `app/api/registrations/`: 报名 API
   - `app/api/registrations/upload-test/`: 文件上传 API

3. **管理员功能**
   - `app/admin/registrations/`: 报名管理（最重要）
   - `app/admin/conferences/`: 会议管理
   - `app/admin/announcements/`: 公告管理
   - `app/admin/users/`: 用户管理
   - `app/admin/settings/`: 网站配置

## 数据流

### 报名流程

1. 学生访问会议详情页 → `app/conferences/[slug]/page.tsx`
2. 点击报名 → `components/register-button.tsx`
3. 创建报名记录 → `app/api/registrations/route.ts`
4. 上传学术测试（如需要）→ `app/api/registrations/upload-test/route.ts`
5. 管理员审核 → `app/admin/registrations/page.tsx`
6. 更新状态 → `app/api/admin/registrations/[id]/status/route.ts`
7. 学生缴费 → `app/api/registrations/[id]/payment/route.ts`

### 管理员审核流程

1. 查看所有报名 → `app/admin/registrations/page.tsx`
2. 筛选会议（可选）
3. 查看学术测试文件（如有）
4. 更新审核状态 → `components/admin/registration-actions.tsx`
5. 确认缴费状态（用于线下缴费）

## 样式系统

- **Tailwind CSS**: 主要样式框架
- **扁平化设计**: 符合要求的现代扁平风格
- **响应式设计**: 支持移动端和桌面端

## 安全考虑

1. **路由保护**: `middleware.ts` 保护管理员路由
2. **权限检查**: 所有 API 路由都检查用户角色
3. **密码加密**: 使用 bcryptjs
4. **文件上传**: 限制文件类型和大小（可扩展）

## 扩展点

1. **文件存储**: 可替换为云存储（Vercel Blob, 阿里云 OSS）
2. **支付集成**: 可集成真实支付系统
3. **邮件通知**: 可添加邮件通知功能
4. **文件预览**: 可添加文件预览功能

