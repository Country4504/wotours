#!/bin/bash

# Docker版MongoDB数据导入脚本 - 使用更新后的备份文件
# 使用方法: ./docker_import_updated.sh

DB_NAME="natours-test"
BACKUP_FILE="natours-test_share_package.tar.gz"

echo "=========================================="
echo "  Docker MongoDB 数据导入工具"
echo "=========================================="
echo "数据库名: $DB_NAME"
echo "备份文件: $BACKUP_FILE"
echo "=========================================="

# 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo "错误: 备份文件 $BACKUP_FILE 不存在"
    exit 1
fi

# 检查MongoDB容器是否运行
echo "检查MongoDB容器状态..."
if ! docker ps | grep -q "natours-mongo"; then
    echo "错误: MongoDB容器未运行"
    echo "请先运行: docker-compose up -d mongo"
    exit 1
fi

# 清理容器中的临时目录
echo "清理临时目录..."
docker exec natours-mongo rm -rf /tmp/import_workspace
docker exec natours-mongo mkdir -p /tmp/import_workspace

# 复制备份文件到容器
echo "复制备份文件到容器..."
docker cp $BACKUP_FILE natours-mongo:/tmp/import_workspace/

# 在容器中解压主备份文件
echo "解压主备份文件..."
docker exec natours-mongo bash -c "cd /tmp/import_workspace && tar -xzf $BACKUP_FILE"

# 进入解压后的目录
echo "进入解压目录..."
docker exec natours-mongo bash -c "cd /tmp/import_workspace/share_package && ls -la"

# 解压嵌套的数据库备份文件
echo "解压数据库备份文件..."
docker exec natours-mongo bash -c "cd /tmp/import_workspace/share_package && tar -xzf natours-test_backup.tar.gz"

# 查找解压后的数据库目录
echo "查找数据库目录..."
DB_DIR=$(docker exec natours-mongo bash -c "find /tmp/import_workspace/share_package -type d -name '$DB_NAME' | head -1")

if [ -z "$DB_DIR" ]; then
    echo "错误: 未找到数据库目录 $DB_NAME"
    echo "查看解压后的结构:"
    docker exec natours-mongo bash -c "find /tmp/import_workspace/share_package -type d"
    exit 1
fi

echo "找到数据库目录: $DB_DIR"

# 导入数据库
echo "正在导入数据库 $DB_NAME..."
docker exec natours-mongo mongorestore --uri "mongodb://admin:Natours12356@localhost:27017/$DB_NAME?authSource=admin" --drop $DB_DIR

# 清理临时文件
echo "清理临时文件..."
docker exec natours-mongo rm -rf /tmp/import_workspace

echo "=========================================="
echo "✅ 数据库导入完成!"
echo "导入的数据库名: $DB_NAME"
echo "=========================================="

# 显示数据库信息
echo ""
echo "数据库信息:"
echo "集合列表:"
docker exec natours-mongo mongosh --uri "mongodb://admin:Natours12356@localhost:27017/$DB_NAME?authSource=admin" --eval "db.getCollectionNames().forEach(function(name){print('- ' + name)});" --quiet

echo ""
echo "文档总数:"
docker exec natours-mongo mongosh --uri "mongodb://admin:Natours12356@localhost:27017/$DB_NAME?authSource=admin" --eval "var count = 0; db.getCollectionNames().forEach(function(name){count += db[name].countDocuments()}); print('总文档数: ' + count);" --quiet

echo ""
echo "各个集合的文档数:"
docker exec natours-mongo mongosh --uri "mongodb://admin:Natours12356@localhost:27017/$DB_NAME?authSource=admin" --eval "db.getCollectionNames().forEach(function(name){print(name + ': ' + db[name].countDocuments())});" --quiet