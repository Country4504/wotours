# Natours 管理员账户创建工具

本项目提供了三种创建管理员账户的方式，您可以根据需要选择最适合的方式。

## 📋 脚本说明

### 1. 简单版本 (`create-admin.js`)
- **特点**: 使用预设的管理员信息，一键创建
- **适用场景**: 快速创建默认管理员账户
- **默认信息**:
  - 姓名: 系统管理员
  - 邮箱: admin@natours.com
  - 密码: Admin123456

### 2. 交互式版本 (`create-admin-interactive.js`)
- **特点**: 交互式输入，可以自定义所有信息
- **适用场景**: 需要自定义管理员信息
- **功能**: 输入验证、重复检查、确认确认

### 3. 命令行版本 (`create-admin-cli.js`)
- **特点**: 支持命令行参数，适合自动化脚本
- **适用场景**: 自动化部署、CI/CD
- **功能**: 参数解析、强制模式、快速创建

## 🚀 使用方法

### 方法一：使用简单版本
```bash
# 进入项目根目录
cd /root/scr

# 运行简单版本
node dev-data/create-admin.js
```

### 方法二：使用交互式版本
```bash
# 进入项目根目录
cd /root/scr

# 运行交互式版本
node dev-data/create-admin-interactive.js

# 查看帮助
node dev-data/create-admin-interactive.js --help
```

### 方法三：使用命令行版本
```bash
# 进入项目根目录
cd /root/scr

# 使用默认信息创建
node dev-data/create-admin-cli.js

# 自定义信息创建
node dev-data/create-admin-cli.js --name "张三" --email admin@example.com --password MyPassword123

# 强制创建（覆盖现有账户）
node dev-data/create-admin-cli.js --email admin@natours.com --force

# 查看帮助
node dev-data/create-admin-cli.js --help
```

## ⚙️ 环境要求

确保以下条件已满足：

1. **Node.js 环境** (>= 18.0.0)
2. **MongoDB 数据库** 正在运行
3. **环境变量配置** (`config.env` 文件存在)
4. **项目依赖** 已安装 (`npm install`)

## 🔧 环境变量配置

确保 `config.env` 文件中包含以下配置：

```env
DATABASE=mongodb://localhost:27017/natours-test
# 或您的生产数据库连接字符串
```

## 🛡️ 安全建议

### 密码安全
1. **首次登录后立即修改密码**
2. **使用强密码**（至少8位，包含大小写字母、数字、特殊字符）
3. **定期更换密码**
4. **不要在代码中硬编码密码**

### 账户安全
1. **妥善保管管理员账户信息**
2. **限制管理员账户的使用范围**
3. **定期检查账户活动**
4. **启用两步验证（如果支持）**

### 数据库安全
1. **定期备份数据库**
2. **设置合适的访问权限**
3. **监控异常活动**

## 🔍 故障排除

### 常见错误及解决方案

#### 1. 数据库连接失败
```
Error: MongooseError: failed to connect to server
```
**解决方案**：
- 检查 MongoDB 是否运行：`sudo systemctl status mongodb`
- 检查数据库连接字符串是否正确
- 确认网络连接正常

#### 2. 邮箱已被注册
```
Error: E11000 duplicate key error collection: users index: email_1 dup key
```
**解决方案**：
- 使用不同的邮箱地址
- 或使用 `--force` 参数覆盖现有账户

#### 3. 密码验证失败
```
Error: Passwords are not the same!
```
**解决方案**：
- 确保两次输入的密码一致
- 密码长度至少8位

#### 4. 环境变量未找到
```
Error: Cannot read property 'DATABASE' of undefined
```
**解决方案**：
- 确保 `config.env` 文件存在
- 检查文件路径是否正确
- 验证环境变量格式

## 📝 管理员权限

创建的管理员账户拥有以下权限：

- ✅ 查看所有旅游线路
- ✅ 创建、编辑、删除旅游线路
- ✅ 管理所有用户账户
- ✅ 查看和删除评价
- ✅ 管理导游账户
- ✅ 系统设置管理

## 🔄 创建后的操作

管理员账户创建成功后，建议执行以下操作：

1. **登录系统**
   - 访问网站首页
   - 使用创建的管理员账户登录

2. **修改默认密码**
   - 登录后进入个人设置
   - 修改为更安全的密码

3. **配置系统**
   - 检查系统设置
   - 配置邮件服务（如果需要）

4. **测试功能**
   - 测试各项管理功能
   - 确认权限正常工作

## 📞 技术支持

如果在使用过程中遇到问题，请检查：

1. **日志文件**: 查看终端输出的错误信息
2. **文档**: 参考 Natours 项目文档
3. **配置**: 确认所有配置文件正确
4. **依赖**: 确认所有依赖已正确安装

---

**创建时间**: 2025年10月
**版本**: 1.0
**维护**: Natours 开发团队