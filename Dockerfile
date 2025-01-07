# Stage 1: Build
FROM node:21-alpine as builder
WORKDIR /app

# Cài đặt Nest CLI
RUN npm install -g @nestjs/cli

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Sao chép mã nguồn và build dự án
COPY . .
RUN nest build

# Stage 2: Production
FROM node:21-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["node", "dist/main.js"]
