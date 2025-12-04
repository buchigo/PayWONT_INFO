# ----------------------------
# 1) Build Stage (Vite React 빌드)
# ----------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ----------------------------
# 2) Production Stage (Nginx로 정적 파일 서빙)
# ----------------------------
FROM nginx:stable-alpine

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location ~* \.(js|mjs|css|png|jpg|jpeg|gif|svg|ico|mp4|woff|woff2)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
