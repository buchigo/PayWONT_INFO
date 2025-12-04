# ----------------------------
# 1) Build Stage (Vite React 빌드)
# ----------------------------
FROM node:20-alpine AS build

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드
COPY . .
RUN npm run build


# ----------------------------
# 2) Production Stage (Nginx로 정적 파일 서빙)
# ----------------------------
FROM nginx:stable-alpine

# 기본 설정파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# SPA 라우팅 지원하는 설정 추가
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    
    include /etc/nginx/mime.types;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files \$uri =404;
    }
}
EOF

# build stage에서 나온 결과 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
