# Token 权限问题解决方案

## 当前问题

GitHub Personal Access Token 返回 403 错误，可能的原因：

1. **Token 权限不足** - Token 没有 `repo` 权限
2. **Token 已过期** - Token 可能已过期或被撤销
3. **仓库访问限制** - 仓库可能有访问限制
4. **Token 格式问题** - Token 可能不正确

## 解决方案

### 方案1：检查并更新 Token 权限

1. **访问 Token 设置页面**：
   - https://github.com/settings/tokens
   - 找到你的 token 或创建新的

2. **确保 Token 有以下权限**：
   - ✅ `repo` - 完整仓库访问权限（必需）
   - ✅ `workflow` - 如果需要 GitHub Actions

3. **创建新的 Token**（推荐）：
   ```
   1. 点击 "Generate new token (classic)"
   2. 设置名称：tjmun_site_deploy
   3. 选择过期时间
   4. 勾选权限：repo（完整仓库访问）
   5. 点击 "Generate token"
   6. 复制 token（只显示一次）
   ```

### 方案2：使用新的 Token 推送

```bash
cd /project/tjmun_site_bag

# 使用新 token 推送
bash push-with-token.sh <你的新token>
```

### 方案3：使用 SSH 方式（推荐，更安全）

1. **生成 SSH 密钥**：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按 Enter 使用默认路径
```

2. **复制公钥**：
```bash
cat ~/.ssh/id_ed25519.pub
```

3. **添加到 GitHub**：
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

4. **更改 remote 为 SSH**：
```bash
git remote set-url origin git@github.com:Gao-cun/tjmun_site.git
git push origin master
```

### 方案4：手动上传（如果网络问题持续）

1. **打包项目**：
```bash
cd /project/tjmun_site_bag
tar -czf ../tjmun_site_bag_clean.tar.gz --exclude='.git' --exclude='node_modules' --exclude='.next' .
```

2. **下载到本地**，然后在本地推送

## 当前本地提交状态

✅ **本地提交已成功保存**
- 提交 ID: `51889e3`
- 提交信息: "清理项目：移除构建产物和临时文件，添加打包部署脚本和文档"
- 状态: 已提交到本地仓库，等待推送到远程

## 安全建议

⚠️ **重要**：你提供的 token 已经暴露，建议：

1. **立即撤销当前 token**：
   - 访问：https://github.com/settings/tokens
   - 找到对应的 token 并撤销

2. **创建新的 token**：
   - 使用新的 token 进行推送
   - 不要将 token 提交到代码仓库

3. **使用环境变量**（推荐）：
```bash
export GITHUB_TOKEN="your-token-here"
git push https://${GITHUB_TOKEN}@github.com/Gao-cun/tjmun_site.git master
```

## 验证 Token 有效性

可以使用 curl 测试 token：

```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

如果返回用户信息，说明 token 有效。
如果返回 401 或 403，说明 token 无效或权限不足。

## 下一步操作

1. 检查 token 权限
2. 创建新的 token（如果有问题）
3. 使用新 token 推送
4. 或者配置 SSH 方式（更安全）

本地提交已安全保存，可以稍后网络恢复或配置正确后再推送。

