# Git 推送指南

## 当前状态

✅ **提交成功**：更改已提交到本地仓库
❌ **推送失败**：无法连接到 GitHub（网络问题）

## 提交信息

- 提交 ID: `51889e3`
- 提交信息: "清理项目：移除构建产物和临时文件，添加打包部署脚本和文档"
- 更改内容: 添加了 GIT.md 文件

## 推送方法

### 方法1：配置代理（如果服务器需要代理）

```bash
# 配置 HTTP 代理
git config --global http.proxy http://proxy-server:port
git config --global https.proxy http://proxy-server:port

# 然后推送
git push origin master
```

### 方法2：使用 SSH 方式（推荐）

```bash
# 1. 将 remote URL 改为 SSH
git remote set-url origin git@github.com:Gao-cun/tjmun_site.git

# 2. 配置 SSH 密钥（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# 将公钥添加到 GitHub

# 3. 推送
git push origin master
```

### 方法3：手动上传打包文件

如果无法直接推送，可以：

1. **打包项目**：
```bash
cd /project/tjmun_site_bag
tar -czf tjmun_site_bag.tar.gz --exclude='.git' --exclude='node_modules' .
```

2. **下载到本地**，然后在本地推送：
```bash
# 在本地
git clone https://github.com/Gao-cun/tjmun_site.git
cd tjmun_site
# 解压文件
tar -xzf tjmun_site_bag.tar.gz
git add .
git commit -m "清理项目"
git push origin master
```

### 方法4：使用 GitHub CLI

```bash
# 安装 GitHub CLI
# 然后使用
gh repo sync
```

## 检查网络连接

```bash
# 测试 GitHub 连接
curl -I https://github.com

# 测试 Git 连接
git ls-remote https://github.com/Gao-cun/tjmun_site.git
```

## 当前提交状态

本地提交已成功，可以稍后网络恢复时再推送，或者使用上述其他方法。

## 查看提交内容

```bash
# 查看提交详情
git show 51889e3

# 查看提交历史
git log --oneline -5
```

