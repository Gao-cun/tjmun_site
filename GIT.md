# Git 操作指南

## 当前 Git 配置

- **Remote URL**: `https://github.com/Gao-cun/tjmun_site.git`
- **当前分支**: `master`
- **工作目录**: 干净（无未提交更改）

## 常用 Git 命令

### 查看状态

```bash
# 查看工作目录状态
git status

# 查看 remote 配置
git remote -v

# 查看提交历史
git log --oneline -10
```

### 提交更改

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "描述信息"

# 推送到远程仓库
git push origin master
```

### 更新远程仓库

```bash
# 拉取远程更改
git pull origin master

# 或者先获取再合并
git fetch origin
git merge origin/master
```

### 如果需要更新 remote URL

```bash
# 查看当前 remote
git remote -v

# 更新 remote URL
git remote set-url origin https://github.com/Gao-cun/tjmun_site.git

# 或者删除后重新添加
git remote remove origin
git remote add origin https://github.com/Gao-cun/tjmun_site.git
```

## 推送清理后的项目

如果要将清理后的项目推送到远程仓库：

```bash
# 1. 检查更改
git status

# 2. 添加所有更改
git add .

# 3. 提交更改
git commit -m "清理项目，移除构建产物和临时文件，添加打包脚本"

# 4. 推送到远程仓库
git push origin master
```

## 注意事项

1. **不要提交敏感信息**：确保 `.env` 文件在 `.gitignore` 中
2. **不要提交构建产物**：`.next/` 和 `node_modules/` 应该在 `.gitignore` 中
3. **检查大文件**：确保没有意外提交大文件

## 当前项目状态

项目已清理完成，Git remote 配置正确，工作目录干净，可以直接进行后续操作。

