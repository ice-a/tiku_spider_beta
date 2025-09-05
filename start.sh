#!/bin/bash

echo "启动题库系统..."
echo

# 检查MongoDB服务
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB服务未运行，请先启动MongoDB服务"
    echo "macOS: brew services start mongodb-community"
    echo "Linux: sudo systemctl start mongod"
    exit 1
fi

echo "MongoDB服务正在运行"
echo

echo "安装依赖..."
npm run setup
if [ $? -ne 0 ]; then
    echo "依赖安装失败"
    exit 1
fi

echo
echo "导入数据..."
npm run server:seed
if [ $? -ne 0 ]; then
    echo "数据导入失败"
    exit 1
fi

echo
echo "启动开发服务器..."
npm run dev:full