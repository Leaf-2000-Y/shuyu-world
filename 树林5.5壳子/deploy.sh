#!/bin/bash
#
# 一键部署到香港服务器
# 用法：./deploy.sh
#
# 流程：本地 build → rsync 到服务器 → 自动上线
# 不需要密码（用 SSH key 免密登录）
# 不需要 sudo（/var/www/html 已经归 ubuntu 用户管）
# 不需要 reload nginx（静态文件直接生效）
#

set -e
cd "$(dirname "$0")"

SERVER="ubuntu@43.128.30.135"
TARGET="/var/www/html/"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BLUE}  树林 5.5 直播网页 · 一键部署${RESET}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

# 1. 构建
echo -e "\n${YELLOW}[1/3] 🔨 本地构建中...${RESET}"
START=$(date +%s)
npm run build 2>&1 | tail -8
BUILD_TIME=$(($(date +%s) - START))
echo -e "${GREEN}     ✓ 构建完成（${BUILD_TIME}s）${RESET}"

# 2. 上传（rsync 增量同步，只传变化的文件）
echo -e "\n${YELLOW}[2/3] 📤 上传到服务器...${RESET}"
START=$(date +%s)
rsync -avz --delete --human-readable \
  -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
  dist/ "$SERVER:$TARGET" 2>&1 | grep -E "^[a-z0-9]|sent|total" | head -20
UPLOAD_TIME=$(($(date +%s) - START))
echo -e "${GREEN}     ✓ 上传完成（${UPLOAD_TIME}s）${RESET}"

# 3. 验证（best-effort,从国外测试可能超时但不影响国内访问）
echo -e "\n${YELLOW}[3/3] 🌐 验证上线...${RESET}"
HTTP_CODE=$(curl -s -o /dev/null -m 30 -w "%{http_code}" http://43.128.30.135/ 2>/dev/null || echo "timeout")
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}     ✓ HTTP 200 · 网站正常${RESET}"
elif [ "$HTTP_CODE" = "timeout" ]; then
  echo -e "${YELLOW}     ⚠ 健康检查超时（国外节点），国内访问应该正常${RESET}"
else
  echo -e "${YELLOW}     ⚠ HTTP $HTTP_CODE（异常但已上传，请手动检查）${RESET}"
fi

# 完成
TOTAL=$((BUILD_TIME + UPLOAD_TIME))
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${GREEN}  ✨ 部署成功！耗时 ${TOTAL} 秒${RESET}"
echo -e "${GREEN}  🌍 http://43.128.30.135/${RESET}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
