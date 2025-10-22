# 使用官方Node.js 18镜像作为基础镜像
FROM docker.m.daocloud.io/node:18-alpine

# 替换为阿里源并更新
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    python3 \
    make \
    g++ \
    && npm install -g nodemon

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 暴露端口
EXPOSE 3000

# 设置环境变量为开发环境
ENV NODE_ENV=development

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 更改文件所有者
RUN chown -R nodejs:nodejs /app
USER nodejs

# 启动开发服务器
CMD ["npm", "run", "dev"]