# Git 推送解决方案

## 当前问题

Git 推送需要认证，HTTPS 方式需要用户名和密码（或 Personal Access Token）。

## 解决方案

### 方案1：使用 Personal Access Token（推荐）

1. **创建 Personal Access Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo`（完整仓库访问权限）
   - 生成 token 并复制

2. **使用 token 推送**：
```bash
cd /project/tjmun_site_bag
git push https://<token>@github.com/Gao-cun/tjmun_site.git master
```

或者配置 credential helper：
```bash
# 配置 credential helper
git config --global credential.helper store

# 推送时会提示输入用户名和 token
git push origin master
# 用户名: Gao-cun
# 密码: <你的 Personal Access Token>
```

### 方案2：使用 SSH 方式

1. **检查 SSH 密钥**：
```bash
ls -la ~/.ssh/
```

2. **如果没有密钥，生成一个**：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按 Enter 使用默认路径
# 设置密码（可选）
```

3. **将公钥添加到 GitHub**：
```bash
# 显示公钥
cat ~/.ssh/id_ed25519.pub

# 复制公钥，然后：
# 1. 访问 https://github.com/settings/keys
# 2. 点击 "New SSH key"
# 3. 粘贴公钥并保存
```

4. **更改 remote URL 为 SSH**：
```bash
git remote set-url origin git@github.com:Gao-cun/tjmun_site.git
git push origin master
```

### 方案3：手动上传（如果网络不稳定）

1. **打包项目**：
```bash
cd /project/tjmun_site_bag
tar -czf ../tjmun_site_bag_clean.tar.gz --exclude='.git' --exclude='node_modules' --exclude='.next' .
```

2. **下载到本地**，然后在本地推送

### 方案4：配置代理（如果需要）

如果服务器需要通过代理访问 GitHub：

```bash
# 配置 HTTP 代理
git config --global http.proxy http://proxy-server:port
git config --global https.proxy http://proxy-server:port

# 推送
git push origin master
```

## 当前提交状态

✅ **本地提交成功**
- 提交 ID: `51889e3`
- 提交信息: "清理项目：移除构建产物和临时文件，添加打包部署脚本和文档"

提交已保存在本地，可以稍后网络恢复或配置认证后再推送。

## 推荐操作

**推荐使用 Personal Access Token 方式**，最简单快捷：

1. 在 GitHub 创建 Personal Access Token
2. 使用 token 推送：
```bash
git push https://<your-token>@github.com/Gao-cun/tjmun_site.git master
```

或者使用 credential helper（更安全）：
```bash
git config --global credential.helper store
git push origin master
# 输入用户名: Gao-cun
# 输入密码: <你的 Personal Access Token>
```

## 验证推送

推送成功后，可以验证：
```bash
git log --oneline -5
git remote show origin
```

