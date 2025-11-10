# 安装说明

## 重要提示

当前 TypeScript 报错主要是因为依赖尚未安装。请按照以下步骤操作：

## 安装步骤

1. **安装依赖**
```bash
cd /root/project/new_tjmun
npm install
```

2. **生成 Prisma Client**
```bash
npm run prisma:generate
```

3. **运行 TypeScript 检查**
```bash
npm run lint
```

安装依赖后，大部分类型错误会自动解决。

## 如果仍有错误

如果安装依赖后仍有错误，请检查：

1. **Node.js 版本**：确保使用 Node.js 18+
```bash
node --version
```

2. **清理缓存并重新安装**
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **重新生成 Next.js 类型**
```bash
rm -rf .next
npm run dev
```

## 常见问题

### "Cannot find module 'next/link'"
- 原因：依赖未安装
- 解决：运行 `npm install`

### "JSX element implicitly has type 'any'"
- 原因：React 类型定义缺失
- 解决：安装依赖后会自动解决，确保 `@types/react` 已安装

### "Cannot find module 'next-auth/react'"
- 原因：next-auth 包未安装
- 解决：运行 `npm install`，确保 `next-auth` 在 package.json 中

