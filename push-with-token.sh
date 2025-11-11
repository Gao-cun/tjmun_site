#!/bin/bash

# 使用 Personal Access Token 推送脚本
# 使用方法: bash push-with-token.sh <your-token>

TOKEN="${1:-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}"

if [ -z "$TOKEN" ]; then
  echo "❌ 错误：请提供 Personal Access Token"
  echo "用法: bash push-with-token.sh <your-token>"
  exit 1
fi

cd /project/tjmun_site_bag

echo "🚀 使用 Personal Access Token 推送..."

# 临时设置 remote URL
git remote set-url origin "https://${TOKEN}@github.com/Gao-cun/tjmun_site.git"

# 推送
if git push origin master; then
  echo "✅ 推送成功！"
  
  # 恢复 remote URL（移除 token）
  git remote set-url origin https://github.com/Gao-cun/tjmun_site.git
  echo "✅ Remote URL 已恢复"
else
  echo "❌ 推送失败"
  echo ""
  echo "可能的原因："
  echo "1. Token 权限不足（需要 repo 权限）"
  echo "2. Token 已过期或被撤销"
  echo "3. 仓库访问权限问题"
  echo ""
  echo "解决方案："
  echo "1. 检查 Token 权限：https://github.com/settings/tokens"
  echo "2. 确保 Token 有 'repo' 权限"
  echo "3. 创建新的 Token 并重试"
  
  # 恢复 remote URL
  git remote set-url origin https://github.com/Gao-cun/tjmun_site.git
  exit 1
fi

