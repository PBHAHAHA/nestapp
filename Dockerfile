# build stage 打包阶段
FROM node:16-alpine

# 创建工作目录
# RUN mkdir -p /app

# 指定工作目录
WORKDIR /app

# 复制当前代码到/app工作目录
COPY package.json .

# npm 源，选用国内镜像源以提高下载速度
RUN npm config set registry https://registry.npm.taobao.org/

# npm 安装依赖
RUN npm install 

#
COPY . .

# 打包
RUN npm run build

RUN npm install -g pm2

# 端口映射
EXPOSE 3100

# VOLUME /app
# 启动服务
# "start:prod": "cross-env NODE_ENV=production node ./dist/src/main.js",
# CMD ["node" , "./dist/main.js"]

CMD ["pm2-runtime", "./dist/main.js"]

