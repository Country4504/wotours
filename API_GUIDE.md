# Natours API 使用指南

## 📋 项目概览

这是一个基于 Node.js + Express + MongoDB 的旅游网站后端 API，提供用户认证、旅游产品管理、预订和评论功能。

## 🚀 快速启动

1. **安装依赖**

   ```bash
   npm install
   ```

2. **配置环境变量**
   复制 `config.env` 并配置以下必需的环境变量：

   - `DATABASE`: MongoDB 连接字符串
   - `JWT_SECRET`: JWT 加密密钥
   - `JWT_EXPIRES_IN`: JWT 过期时间
   - `JWT_COOKIE_EXPIRES_IN`: Cookie 过期时间

3. **启动开发服务器**

   ```bash
   npm start
   ```

4. **导入测试数据**
   ```bash
   node dev-data/data/import-dev-data.js --import
   ```

## 🔐 用户认证

### 注册

- **URL**: `POST /api/v1/users/signup`
- **描述**: 创建新用户账户
- **请求体**:
  ```json
  {
    "name": "用户名",
    "email": "email@example.com",
    "password": "密码（至少8位）",
    "passwordConfirm": "确认密码"
  }
  ```
- **响应**: 返回创建的用户信息和 JWT token

### 登录

- **URL**: `POST /api/v1/users/login`
- **描述**: 用户登录获取认证 token
- **请求体**:
  ```json
  {
    "email": "email@example.com",
    "password": "密码"
  }
  ```
- **响应**: 返回用户信息和 JWT token

### 登出

- **URL**: `GET /api/v1/users/logout`
- **描述**: 清除认证 cookie
- **要求**: 需要登录

## 👤 用户账户管理

### 获取当前用户信息

- **URL**: `GET /api/v1/users/me`
- **描述**: 获取当前登录用户的详细信息
- **要求**: 需要登录

### 更新用户资料

- **URL**: `PATCH /api/v1/users/updateMe`
- **描述**: 更新用户名称、邮箱和头像
- **要求**: 需要登录
- **格式**: `multipart/form-data`
- **字段**:
  - `name`: 用户名
  - `email`: 邮箱
  - `photo`: 头像图片文件（可选）

### 修改密码

- **URL**: `PATCH /api/v1/users/updateMyPassword`
- **描述**: 修改用户密码
- **要求**: 需要登录
- **请求体**:
  ```json
  {
    "passwordCurrent": "当前密码",
    "password": "新密码（至少8位）",
    "passwordConfirm": "确认新密码"
  }
  ```

### 删除账户

- **URL**: `DELETE /api/v1/users/deleteMe`
- **描述**: 软删除用户账户
- **要求**: 需要登录

### 忘记密码

- **URL**: `POST /api/v1/users/forgotPassword`
- **描述**: 发送密码重置邮件
- **请求体**:
  ```json
  {
    "email": "email@example.com"
  }
  ```

### 重置密码

- **URL**: `PATCH /api/v1/users/resetPassword/:token`
- **描述**: 使用重置 token 设置新密码
- **请求体**:
  ```json
  {
    "password": "新密码（至少8位）",
    "passwordConfirm": "确认新密码"
  }
  ```

## 🏃 旅游产品

### 获取所有旅游产品

- **URL**: `GET /api/v1/tours`
- **描述**: 获取旅游产品列表，支持分页和过滤
- **查询参数**:
  - `page`: 页码
  - `limit`: 每页数量
  - `sort`: 排序字段
  - `fields`: 返回字段
  - `duration[gte]`: 最小天数
  - `duration[lte]`: 最大天数
  - `price[gte]`: 最低价格
  - `price[lte]`: 最高价格
  - `ratingsAverage[gte]`: 最低评分

### 获取单个旅游产品

- **URL**: `GET /api/v1/tours/:slug`
- **描述**: 获取指定旅游产品的详细信息

### 获取热门旅游产品（前 5 名）

- **URL**: `GET /api/v1/tours/top-5-cheap`
- **描述**: 获取评分最高的 5 个旅游产品

### 获取旅游产品统计

- **URL**: `GET /api/v1/tours/tour-stats`
- **描述**: 获取旅游产品统计信息

### 获取指定月份的旅游计划

- **URL**: `GET /api/v1/tours/monthly-plan/:year`
- **描述**: 获取指定年份的旅游计划

## 💬 评论系统

### 获取旅游产品的所有评论

- **URL**: `GET /api/v1/tours/:tourId/reviews`
- **描述**: 获取指定旅游产品的所有评论

### 创建评论

- **URL**: `POST /api/v1/reviews`
- **描述**: 为旅游产品创建评论
- **要求**: 需要登录
- **请求体**:
  ```json
  {
    "review": "评论内容",
    "rating": "评分（1-5）",
    "tour": "旅游产品ID"
  }
  ```

### 更新评论

- **URL**: `PATCH /api/v1/reviews/:id`
- **描述**: 更新自己的评论
- **要求**: 需要登录，只能更新自己的评论

### 删除评论

- **URL**: `DELETE /api/v1/reviews/:id`
- **描述**: 删除自己的评论
- **要求**: 需要登录，只能删除自己的评论

## 📅 预订系统

### 获取我的预订

- **URL**: `GET /api/v1/bookings/my-bookings`
- **描述**: 获取当前用户的所有预订
- **要求**: 需要登录

## 👥 用户角色权限

- **user**: 普通用户，可以查看产品、预订、评论
- **guide**: 导游，查看更多信息
- **lead-guide**: 首席导游，管理权限
- **admin**: 管理员，完全访问权限

## 📱 前端页面路由

- `/`: 首页 - 旅游产品列表
- `/tour/:slug`: 旅游产品详情页
- `/login`: 登录页面
- `/signup`: 注册页面
- `/me`: 用户账户管理页面
- `/my-tours`: 我的预订页面

## 🛠️ 开发命令

```bash
# 启动开发服务器
npm start

# 生产模式启动
npm start:prod

# 编译前端 JavaScript
npm run build:js

# 监听前端文件变化
npm run watch:js

# 重新导入测试数据
node dev-data/data/import-dev-data.js --delete
node dev-data/data/import-dev-data.js --import
```
