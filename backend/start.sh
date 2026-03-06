#!/bin/bash

# ============================================
# 食谱小程序后端 - 启动脚本
# ============================================

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境变量
check_env() {
    if [ ! -f .env ]; then
        print_error ".env 文件不存在！"
        print_warn "请先创建 .env 文件并配置 API Key"
        exit 1
    fi

    if ! grep -q "DASHSCOPE_API_KEY=" .env || grep -q "your_dashscope_api_key_here" .env; then
        print_error "未配置通义千问 API Key！"
        print_warn "请在 .env 文件中设置 DASHSCOPE_API_KEY"
        exit 1
    fi

    print_info "环境变量检查通过"
}

# 启动服务
start_server() {
    print_info "启动食谱小程序后端服务..."
    echo ""
    print_info "API 文档地址:"
    print_info "  - Swagger UI: http://localhost:8000/docs"
    print_info "  - ReDoc: http://localhost:8000/redoc"
    print_info "  - 健康检查: http://localhost:8000/api/health"
    echo ""
    print_info "按 Ctrl+C 停止服务"
    echo ""

    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# 主流程
main() {
    check_env
    start_server
}

# 运行主流程
main