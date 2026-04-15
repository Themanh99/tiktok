# DevOps, Docker, CI/CD & Cloud (AWS/Vercel) — Kiến Thức Chuyên Sâu (Mid/Senior)

> Tài liệu này bao gồm kiến thức nền tảng cần học trước, sau đó là các câu hỏi phỏng vấn kèm câu trả lời chi tiết.

---

# PHẦN A — KIẾN THỨC NỀN TẢNG CẦN HỌC

---

## I. Docker 

### 1.1 Docker là gì? Tại sao cần Docker?
Docker là công cụ đóng gói ứng dụng cùng với TẤT CẢ dependencies (runtime, libraries, config) vào một **Container** nhẹ, cô lập, chạy nhất quán trên mọi môi trường.

**Vấn đề Docker giải quyết:**
```
❌ Trước Docker:
Developer: "Máy tôi chạy ngon!"
Tester:    "Máy tôi lỗi!"
DevOps:    "Server production crash!"
→ Nguyên nhân: Mỗi máy cài phiên bản Node, Python, OS library khác nhau

✅ Sau Docker:
Mọi người chạy cùng 1 image → cùng OS, cùng Node version, cùng dependencies
→ "Works on my machine" → "Works everywhere"
```

### 1.2 Container vs Virtual Machine (VM)

```
┌─────────────────────────────────────────────────────┐
│ Virtual Machine (VM)          │ Docker Container     │
├───────────────────────────────┼──────────────────────┤
│ ┌───────────┐ ┌────────────┐ │ ┌──────┐ ┌──────┐   │
│ │  App A    │ │  App B     │ │ │App A │ │App B │   │
│ │ Libraries │ │ Libraries  │ │ │ Libs │ │ Libs │   │
│ │ Guest OS  │ │ Guest OS   │ │ └──┬───┘ └──┬───┘   │
│ │ (Ubuntu)  │ │ (CentOS)   │ │    │        │       │
│ └───────────┘ └────────────┘ │ ┌──┴────────┴───┐   │
│ ┌──────────────────────────┐ │ │ Docker Engine  │   │
│ │       Hypervisor         │ │ └───────┬────────┘   │
│ └──────────────────────────┘ │         │            │
│ ┌──────────────────────────┐ │ ┌───────┴────────┐   │
│ │        Host OS           │ │ │    Host OS     │   │
│ └──────────────────────────┘ │ └────────────────┘   │
│                               │                      │
│ Nặng: GB mỗi VM              │ Nhẹ: MB mỗi container│
│ Khởi động: Phút              │ Khởi động: Giây       │
│ Có Guest OS riêng            │ Chia sẻ Host OS kernel│
└───────────────────────────────┴──────────────────────┘
```

### 1.3 Các khái niệm cốt lõi Docker

**Image:** Bản thiết kế (blueprint) — file bất biến (immutable) chứa app + dependencies. Giống file ISO.  
**Container:** Instance đang chạy của image. Giống VM đang boot từ ISO. Có thể tạo nhiều container từ 1 image.  
**Dockerfile:** File text chứa các lệnh build image.  
**Docker Hub / Registry:** Kho chứa images (giống GitHub cho code). Docker Hub là registry public mặc định.  
**Volume:** Lưu trữ persistent data — data tồn tại ngay cả khi container bị xóa.  

### 1.4 Dockerfile — Viết từ cơ bản đến nâng cao

```dockerfile
# ═══════════════ Dockerfile CƠ BẢN ═══════════════

# 1. Chọn base image (nền tảng)
FROM node:20

# 2. Đặt thư mục làm việc bên trong container
WORKDIR /app

# 3. Copy file khai báo dependencies trước (tận dụng layer cache)
COPY package.json package-lock.json ./

# 4. Cài dependencies
RUN npm ci
# npm ci thay vì npm install vì:
# - ci cài CHÍNH XÁC version trong lock file (reproducible)
# - ci xóa node_modules cũ trước khi cài (clean install)
# - ci nhanh hơn trong CI/CD environment

# 5. Copy toàn bộ source code
COPY . .

# 6. Build ứng dụng
RUN npm run build

# 7. Mở port (chỉ mang tính tài liệu, không tự expose)
EXPOSE 3000

# 8. Lệnh chạy khi container start
CMD ["node", "dist/main.js"]
```

**Tại sao COPY package.json TRƯỚC rồi mới COPY source?**
```
Docker build theo LAYERS. Mỗi lệnh (FROM, COPY, RUN) tạo 1 layer.
Nếu layer không thay đổi → Docker dùng CACHE (không chạy lại).

Nếu COPY . . trước rồi npm install:
  - Mỗi lần sửa 1 dòng code → layer COPY thay đổi
  → npm install chạy lại từ đầu (mất 2-3 phút)

Nếu COPY package.json trước, npm install, rồi COPY . .:
  - Sửa code → chỉ layer COPY . . thay đổi
  → npm install DÙNG CACHE (vì package.json không đổi)
  → Build nhanh hơn hàng phút
```

### 1.5 Multi-stage Build (Build nhiều tầng)

```dockerfile
# ═══════════════ Multi-stage cho NestJS Backend ═══════════════

# ── Stage 1: Build ──
FROM node:20 AS builder
# Image node:20 đầy đủ (~1GB) — có cả npm, build tools, dev dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                          # Cài TẤT CẢ dependencies (kể cả devDependencies)
COPY . .
RUN npm run build                   # TypeScript → JavaScript (output: dist/)

# ── Stage 2: Production ──
FROM node:20-alpine AS production
# Image alpine CỰC NHẸ (~130MB) — chỉ có runtime tối thiểu

WORKDIR /app

# Chỉ cài production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy KẾT QUẢ build từ stage 1 (không copy source code, devDependencies!)
COPY --from=builder /app/dist ./dist

# Security: Không chạy bằng root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001 -G nodejs
USER nestjs

EXPOSE 3000
CMD ["node", "dist/main.js"]

# Kết quả: Image chỉ ~150MB thay vì ~1.5GB
# Source code TypeScript KHÔNG có trong image production → bảo mật
```

```dockerfile
# ═══════════════ Multi-stage cho React/Vue Frontend ═══════════════

# ── Stage 1: Build React/Vue ──
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build                   # Output: dist/ hoặc build/ (HTML, CSS, JS tĩnh)

# ── Stage 2: Serve bằng Nginx ──
FROM nginx:alpine AS production
# Nginx alpine chỉ ~20MB!

# Copy file tĩnh đã build vào thư mục serve của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy config Nginx (quan trọng cho SPA routing!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Kết quả: Image chỉ ~25MB! Siêu nhẹ, siêu nhanh.
```

```nginx
# nginx.conf — Config cho SPA (React/Vue)
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # QUAN TRỌNG: Mọi route trả về index.html
    # Giải quyết vấn đề F5 refresh bị 404
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 1.6 .dockerignore
```
# .dockerignore — KHÔNG copy những thứ này vào image
node_modules          # Cực kỳ quan trọng! Cài lại trong container
.git                  # Lịch sử git không cần trong production
.env                  # KHÔNG BAO GIỜ đóng gói secrets vào image!
.env.local            
dist                  # Build lại trong container
coverage              # Test coverage
*.md                  # Documentation
.vscode               # IDE config
```

### 1.7 Docker Compose — Chạy nhiều Container cùng lúc

```yaml
# docker-compose.yml
# Chạy 3 service: Backend NestJS + PostgreSQL + Redis

version: '3.8'

services:
  # ─── PostgreSQL Database ───
  postgres:
    image: postgres:16-alpine
    container_name: myapp-db
    environment:
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: secret123      # Production: dùng Docker Secrets
      POSTGRES_DB: myapp_dev
    ports:
      - "5432:5432"                     # host:container — để DBeaver kết nối từ máy host
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persistent storage
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─── Redis Cache ───
  redis:
    image: redis:7-alpine
    container_name: myapp-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # ─── NestJS Backend ───
  api:
    build:
      context: ./backend             # Thư mục chứa Dockerfile
      dockerfile: Dockerfile
    container_name: myapp-api
    ports:
      - "3000:3000"
    environment:
      DATABASE_HOST: postgres         # ← Dùng TÊN SERVICE thay vì IP!
      DATABASE_PORT: 5432             #    Docker Compose tự tạo DNS nội bộ
      DATABASE_USER: myapp
      DATABASE_PASSWORD: secret123
      DATABASE_NAME: myapp_dev
      REDIS_HOST: redis               # ← Tên service redis
      REDIS_PORT: 6379
      NODE_ENV: development
    depends_on:
      postgres:
        condition: service_healthy    # Chờ postgres healthy rồi mới start
      redis:
        condition: service_started
    volumes:
      - ./backend:/app                # Mount source code → hot reload khi dev
      - /app/node_modules             # KHÔNG mount node_modules từ host

# Named volumes — data tồn tại khi container bị xóa/recreate
volumes:
  postgres_data:
  redis_data:
```

**Docker Networking:**
```
Trong docker-compose, các services tự động kết nối nhau qua tên service:
api → kết nối postgres bằng hostname "postgres" (không phải localhost!)
api → kết nối redis bằng hostname "redis"

Các loại network:
- Bridge (mặc định): Container giao tiếp qua private network
- Host: Container dùng chung network với host (không isolation)
- Overlay: Multi-host networking (Docker Swarm, Kubernetes)
```

**Lệnh Docker Compose thường dùng:**
```bash
docker-compose up -d          # Chạy tất cả services (background)
docker-compose down           # Dừng và xóa containers
docker-compose logs -f api    # Xem log realtime của service api
docker-compose exec api sh    # Vào shell bên trong container api
docker-compose build          # Build lại images
docker-compose ps             # Liệt kê containers đang chạy
```

---

## II. CI/CD (Continuous Integration / Continuous Deployment)

### 2.1 CI/CD là gì?

```
┌────────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE                              │
│                                                                    │
│  Developer     CI (Continuous Integration)      CD (Deployment)    │
│  ─────────     ──────────────────────────       ────────────────   │
│                                                                    │
│  Push code ──→ ┌──────┐ ┌──────┐ ┌───────┐ ──→ ┌────────────┐    │
│  to Git        │ Lint │→│ Test │→│ Build │     │   Deploy   │    │
│                └──────┘ └──────┘ └───────┘     │ (Staging/  │    │
│  Open PR ────→ Auto run pipeline               │ Production)│    │
│                                                 └────────────┘    │
│  Merge to ───→ Trigger deployment                                  │
│  main                                                              │
└────────────────────────────────────────────────────────────────────┘
```

**CI (Continuous Integration):**
- Mỗi khi developer push code → tự động chạy: Lint (kiểm tra code style) → Unit Test → Integration Test → Build.
- Mục đích: Phát hiện lỗi SỚM nhất, trước khi merge vào nhánh chính.
- Nếu bất kỳ bước nào FAIL → chặn merge Pull Request → đèn đỏ.

**CD (Continuous Deployment/Delivery):**
- Sau khi code merge vào `main` → tự động build Docker image → deploy lên server.
- **Continuous Delivery:** Tự động đến bước sẵn sàng deploy, nhưng CẦN người duyệt (approval) mới deploy production.
- **Continuous Deployment:** Tự động deploy hết, không cần approval. (Rủi ro hơn, cần test coverage cao).

### 2.2 GitHub Actions — Pipeline thực tế

```yaml
# .github/workflows/ci-cd.yml

name: CI/CD Pipeline

# Trigger: khi push lên main hoặc tạo PR vào main
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Environment variables dùng chung
env:
  NODE_VERSION: '20'
  REGISTRY: docker.io
  IMAGE_NAME: myapp/backend

jobs:
  # ═══════════════ JOB 1: CI — LINT & TEST ═══════════════
  ci:
    name: Lint & Test
    runs-on: ubuntu-latest  # Máy ảo GitHub cung cấp miễn phí

    # Service containers (giống docker-compose)
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-    # Health check
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      # 1. Checkout code
      - uses: actions/checkout@v4

      # 2. Setup Node.js
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'    # Cache node_modules giữa các lần chạy

      # 3. Install dependencies
      - run: npm ci

      # 4. Lint — kiểm tra code style
      - name: Run ESLint
        run: npm run lint

      # 5. Type check — kiểm tra TypeScript
      - name: Type Check
        run: npx tsc --noEmit

      # 6. Unit Tests
      - name: Run Tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/test_db

      # 7. Upload test coverage report
      - name: Upload Coverage
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  # ═══════════════ JOB 2: BUILD DOCKER IMAGE ═══════════════
  build:
    name: Build & Push Docker Image
    needs: ci          # Chỉ chạy nếu CI pass
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # Chỉ build khi merge vào main

    steps:
      - uses: actions/checkout@v4

      # Login vào Docker Hub (credentials lưu trong GitHub Secrets)
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # Build & Push image với tag = git sha (unique mỗi commit)
      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.IMAGE_NAME }}:latest
            ${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=registry,ref=${{ env.IMAGE_NAME }}:latest
          cache-to: type=inline

  # ═══════════════ JOB 3: DEPLOY TO SERVER ═══════════════
  deploy:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      # SSH vào server EC2 và deploy
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}          # IP server
          username: ${{ secrets.EC2_USERNAME }}    # ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}          # Private key SSH
          script: |
            cd /home/ubuntu/myapp
            
            # Pull image mới nhất
            docker-compose pull api
            
            # Restart service (zero downtime bằng --no-deps)
            docker-compose up -d --no-deps --build api
            
            # Dọn images cũ
            docker image prune -f
            
            echo "✅ Deployed successfully: ${{ github.sha }}"
```

### 2.3 Deployment Strategies (Chiến lược Deploy không downtime)

```
┌─────────────────────────────────────────────────────────────────┐
│ ROLLING UPDATE                                                   │
│ ─────────────                                                    │
│ [v1] [v1] [v1] [v1]    ← 4 instances chạy v1                   │
│ [v2] [v1] [v1] [v1]    ← Thay 1 instance sang v2               │
│ [v2] [v2] [v1] [v1]    ← Thay tiếp...                          │
│ [v2] [v2] [v2] [v2]    ← Hoàn tất, tất cả chạy v2             │
│ ✅ Đơn giản, zero downtime                                      │
│ ❌ Có thời điểm v1 và v2 chạy đồng thời → cần backward compat  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BLUE-GREEN DEPLOYMENT                                            │
│ ─────────────────────                                            │
│ Load Balancer ──→ [Blue: v1] [v1] [v1]   ← Đang phục vụ user  │
│                   [Green: v2] [v2] [v2]  ← Chuẩn bị sẵn       │
│                                                                  │
│ Test xong Green → Chuyển Load Balancer:                          │
│ Load Balancer ──→ [Green: v2] [v2] [v2]  ← Phục vụ user        │
│                   [Blue: v1] [v1] [v1]   ← Giữ để rollback     │
│ ✅ Rollback cực nhanh (chuyển LB lại Blue)                      │
│ ❌ Tốn gấp đôi tài nguyên                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CANARY DEPLOYMENT                                                │
│ ─────────────────                                                │
│ Load Balancer ──→ 95% traffic → [v1] [v1] [v1] [v1]            │
│               ──→  5% traffic → [v2]        ← "Chim hoàng yến" │
│                                                                  │
│ Monitor v2 OK → Tăng dần: 10% → 25% → 50% → 100%              │
│ v2 lỗi → Chuyển 100% về v1 ngay lập tức                        │
│ ✅ Rủi ro thấp nhất (chỉ 5% user bị ảnh hưởng nếu bug)        │
│ ❌ Phức tạp setup, cần monitoring tốt                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## III. Vercel — Deploy Frontend Nhanh

### 3.1 Vercel là gì?
Vercel là platform cloud tối ưu cho Frontend frameworks (Next.js, React, Vue, Svelte). Zero-config deployment — chỉ cần connect Git repo → mỗi push tự deploy.

### 3.2 Tính năng quan trọng

```
┌──────────────────────────────────────────────────────────┐
│                    VERCEL FEATURES                        │
├──────────────────────────────────────────────────────────┤
│ ✅ Auto Deploy: Push to Git → tự build & deploy          │
│ ✅ Preview Deployments: Mỗi PR → URL preview riêng       │
│ ✅ Edge Network (CDN): Static files serve từ 70+ regions │
│ ✅ Serverless Functions: API routes chạy serverless       │
│ ✅ Environment Variables: Quản lý env cho từng environment│
│ ✅ Custom Domains: Map domain riêng + auto SSL (HTTPS)    │
│ ✅ Analytics: Performance metrics built-in                │
└──────────────────────────────────────────────────────────┘
```

### 3.3 vercel.json — Config cho SPA

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3.4 Vấn đề SPA Refresh 404

**Nguyên nhân:**
```
React/Vue SPA chỉ có 1 file index.html.
Mọi URL (/products, /about, /users/123) được xử lý bởi JavaScript Router.

Khi user ở /products/123 bấm F5:
  Browser → Server: "Cho tôi file /products/123"
  Server: "Không có file nào tên products/123" → 404!

Giải pháp: Cấu hình server trả index.html cho MỌI route:
  Browser → Server: "Cho tôi file /products/123"  
  Server: "Đây, index.html cho bạn"
  Browser load index.html → JS Router đọc URL → render đúng component
```

**Config cho các platform khác nhau:**
```bash
# Vercel: vercel.json (rewrites)
# Nginx: try_files $uri $uri/ /index.html
# Netlify: _redirects file → /* /index.html 200
# Apache: .htaccess → RewriteRule → /index.html
```

### 3.5 Environment Variables trên Vercel

```
Vercel Dashboard → Project → Settings → Environment Variables

3 loại environment:
┌─────────────┬───────────────────────────────────────┐
│ Production  │ Chỉ áp dụng khi deploy nhánh main     │
│ Preview     │ Áp dụng cho mọi PR/preview deployment  │
│ Development │ Dùng khi chạy `vercel dev` local       │
└─────────────┴───────────────────────────────────────┘

Ví dụ:
NEXT_PUBLIC_API_URL=https://api.production.com    (Production)
NEXT_PUBLIC_API_URL=https://api.staging.com       (Preview)

⚠️ QUAN TRỌNG:
- Biến BẮT ĐẦU bằng NEXT_PUBLIC_ → Expose ra client-side (browser thấy được)
- Biến KHÔNG có prefix → Chỉ server-side (API routes, getServerSideProps)
- Biến VITE_ → cho Vite projects
- KHÔNG BAO GIỜ đặt secrets (DB password, API keys) với prefix public!
```

---

## IV. AWS Cloud — Kiến Thức Thực Chiến

### 4.1 AWS Services Map cho Web App

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS ARCHITECTURE CHO WEB APP                  │
│                                                                  │
│  User Browser                                                    │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────┐     ┌─────────────────────────┐                │
│  │ Route 53    │────→│ CloudFront (CDN)        │                │
│  │ (DNS)       │     │ Cache static assets      │                │
│  └─────────────┘     └────────┬────────────────┘                │
│                               │                                  │
│                    ┌──────────┴──────────┐                       │
│                    │                     │                        │
│               ┌────▼────┐         ┌─────▼──────┐                │
│               │ S3      │         │ ALB        │                │
│               │ (Static │         │ (Load      │                │
│               │  Files) │         │  Balancer) │                │
│               └─────────┘         └─────┬──────┘                │
│                                         │                        │
│                               ┌─────────┴─────────┐             │
│                               │                    │             │
│                          ┌────▼────┐         ┌────▼────┐        │
│                          │ EC2     │         │ EC2     │        │
│                          │ (App 1) │         │ (App 2) │        │
│                          └────┬────┘         └────┬────┘        │
│                               │                    │             │
│                          ┌────▼────────────────────▼────┐       │
│                          │         RDS PostgreSQL       │       │
│                          │      (Managed Database)      │       │
│                          └──────────────────────────────┘       │
│                                                                  │
│                          ┌──────────────────────────────┐       │
│                          │       ElastiCache Redis      │       │
│                          │       (Managed Cache)        │       │
│                          └──────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 EC2 (Elastic Compute Cloud)

**EC2 là gì?**
Máy chủ ảo (Virtual Server) trên AWS. Bạn thuê 1 máy tính Linux/Windows trên cloud, SSH vào, cài Docker, chạy app.

```bash
# Workflow setup EC2 cho NestJS backend:

# 1. Tạo EC2 instance (Ubuntu 22.04, t3.micro cho dev/staging)
# 2. SSH vào server
ssh -i my-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com

# 3. Cài Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu  # Cho phép chạy docker không cần sudo

# 4. Clone project hoặc pull Docker image
docker pull myapp/backend:latest

# 5. Chạy với docker-compose
docker-compose up -d

# 6. Cấu hình Security Group (Firewall):
# - Port 22 (SSH): Chỉ IP của bạn
# - Port 80/443 (HTTP/HTTPS): Mở cho 0.0.0.0/0 (public)
# - Port 5432 (PostgreSQL): KHÔNG mở public! Chỉ private subnet
```

**Instance Types:**

| Type | CPU | RAM | Use case |
|---|---|---|---|
| t3.micro | 2 vCPU | 1 GB | Dev/test (Free Tier) |
| t3.small | 2 vCPU | 2 GB | Staging |
| t3.medium | 2 vCPU | 4 GB | Production nhỏ |
| c5.xlarge | 4 vCPU | 8 GB | Production compute-intensive |

### 4.3 RDS (Relational Database Service)

**Tại sao dùng RDS thay vì cài PostgreSQL trên EC2?**

```
┌────────────────────────────────────────────────────────┐
│  Tự cài PostgreSQL trên EC2  │  Dùng AWS RDS           │
├──────────────────────────────┼─────────────────────────┤
│ Tự backup thủ công           │ Auto backup hàng ngày   │
│ Tự update/patch OS + DB      │ AWS tự update           │
│ Tự cấu hình replication      │ Multi-AZ 1 click        │
│ Downtime khi hardware lỗi    │ Auto failover           │
│ Tự monitor                   │ CloudWatch tích hợp     │
│ Tự scale storage             │ Auto scale storage      │
│ Rẻ hơn (chỉ trả EC2)        │ Đắt hơn 2-3x           │
│ Dev mới dễ làm sai           │ Best practices sẵn      │
├──────────────────────────────┼─────────────────────────┤
│ Dùng cho: Dev/học/prototype  │ Dùng cho: Production    │
└──────────────────────────────┴─────────────────────────┘
```

**Multi-AZ (High Availability):**
```
Khi bật Multi-AZ, AWS tạo bản sao (standby) ở Availability Zone khác:
                                                    
  AZ-a (Primary)              AZ-b (Standby)
  ┌──────────────┐             ┌──────────────┐
  │  PostgreSQL  │──────────→  │  PostgreSQL  │
  │   (Active)   │  Sync       │  (Passive)   │
  └──────┬───────┘  Replication└──────────────┘
         │
  App kết nối ←── DNS endpoint tự chuyển khi primary fail

Nếu AZ-a sập → AWS tự chuyển DNS sang AZ-b (failover trong ~60 giây)
→ App không cần thay đổi connection string!
```

**Read Replicas (Scale đọc):**
```
Write queries ──→ Primary DB (RDS Master)
                        │
                   Async Replication
                        │
               ┌────────┴────────┐
               │                  │
          Read Replica 1     Read Replica 2
               │                  │
               └────────┬────────┘
                        │
Read queries  ──────────┘

Use case: App có 90% read, 10% write
→ Write đẩy vào Master
→ Read phân tải qua nhiều Replicas
```

### 4.4 S3 (Simple Storage Service)

```
S3 là kho lưu trữ object (file) trên cloud. Không giới hạn dung lượng.
Dùng cho: Upload avatar, ảnh sản phẩm, file PDF, video, backup, static website.
```

**Pre-signed URLs — Upload an toàn từ Client:**
```
Luồng truyền thống (KHÔNG tốt):
Client ──→ Backend ──→ S3
        File           File
(Backend phải nhận file → tốn RAM/CPU → rồi upload S3 → chậm, tốn tài nguyên)

Luồng Pre-signed URL (TỐT):
1. Client ──→ Backend: "Tôi muốn upload avatar.jpg"
2. Backend ──→ S3: "Tạo cho tôi 1 URL upload, hạn 5 phút"
3. S3 ──→ Backend: "Đây: https://s3.../avatar.jpg?signature=xxx&expires=300"
4. Backend ──→ Client: Pre-signed URL
5. Client ──→ S3: Upload file TRỰC TIẾP (không qua backend!)

Lợi ích:
- Backend không phải xử lý file → tiết kiệm CPU/RAM/Bandwidth
- Upload nhanh hơn (client → S3 trực tiếp)
- URL có thời hạn → bảo mật
```

```typescript
// NestJS: Tạo pre-signed URL
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadService {
  private s3 = new S3Client({ region: 'ap-southeast-1' });

  async getUploadUrl(filename: string, contentType: string) {
    const key = `uploads/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: 'myapp-uploads',
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 300 }); // 5 phút

    return {
      uploadUrl: url,                                          // Client dùng URL này để PUT file
      fileUrl: `https://myapp-uploads.s3.amazonaws.com/${key}`, // URL file sau khi upload xong
    };
  }
}
```

### 4.5 CloudFront (CDN)
```
CloudFront là Content Delivery Network của AWS.
Cache static content (HTML, CSS, JS, images) tại 450+ edge locations toàn cầu.

Không có CDN:
  User ở Việt Nam → Request → Server ở US-East → 200ms latency

Có CloudFront:
  User ở Việt Nam → Request → Edge location Singapore → 20ms latency
  (File đã được cache sẵn tại Singapore)

Kết hợp S3 + CloudFront:
  S3 Bucket (origin) → CloudFront (cache) → User
  
  Lần đầu: CloudFront fetch từ S3 → cache → trả user (hơi chậm)
  Lần sau: CloudFront trả từ cache → CỰC NHANH (không gọi S3)
```

### 4.6 IAM (Identity and Access Management)

```
IAM quản lý AI ĐƯỢC LÀM GÌ trên AWS.

Nguyên tắc: Principle of Least Privilege — Chỉ cấp ĐÚNG quyền cần thiết.

Ví dụ:
  Backend service cần upload file S3:
    ✅ Cấp quyền: s3:PutObject trên bucket myapp-uploads/*
    ❌ KHÔNG cấp: s3:* (toàn quyền S3) — quá rộng, nguy hiểm

Các concept:
  User:   Tài khoản cho người (developer, devops)
  Role:   Tài khoản cho service (EC2, Lambda). Không có password, dùng temporary credentials.
  Policy: Tài liệu JSON định nghĩa quyền (Allow/Deny)
  Group:  Nhóm users có cùng quyền (developers group, admins group)
```

---

# PHẦN B — CÂU HỎI PHỎNG VẤN & TRẢ LỜI

---

## Q1: Docker Multi-stage Build là gì? Tại sao quan trọng?
**Trả lời:**
Multi-stage dùng nhiều FROM trong 1 Dockerfile. Stage 1 (builder) cài đầy đủ devDependencies, build TypeScript → JS. Stage 2 (production) dùng image alpine nhẹ, chỉ COPY thư mục dist và production dependencies từ stage 1.
- **Lợi ích:** Giảm image từ ~1.5GB xuống ~150MB. Source code TypeScript KHÔNG có trong image production → bảo mật. Boot nhanh hơn, pull nhanh hơn, tiết kiệm storage.

## Q2: Mô phỏng quy trình CI/CD từ push code đến production.
**Trả lời:**
1. Dev push code → GitHub Actions trigger pipeline.
2. **CI:** Lint → Type check → Unit test → Integration test. Fail bất kỳ → chặn merge PR.
3. Trưởng nhóm review, approve, merge vào main.
4. **CD:** Build Docker image → Tag với git SHA → Push lên Docker Hub/ECR → SSH vào EC2 → `docker-compose pull && up -d` → Deploy xong.
5. Health check: Kiểm tra endpoint `/health` trả 200 → deploy thành công.

## Q3: Tại sao SPA bấm F5 bị 404? Cách fix?
**Trả lời:**
SPA chỉ có 1 file `index.html`. URL `/products/123` được JS Router xử lý, không phải file thật. Khi F5 → browser gửi request cho server tìm file `/products/123` → không tồn tại → 404.
- **Fix:** Cấu hình server rewrite TẤT CẢ routes về `index.html`. Vercel: `vercel.json` rewrites. Nginx: `try_files $uri $uri/ /index.html`. Netlify: `_redirects` file.

## Q4: Tại sao dùng RDS thay vì cài PostgreSQL trên EC2?
**Trả lời:**
RDS là Managed Database — AWS lo backup tự động hàng ngày, patching OS/DB, monitoring (CloudWatch), Multi-AZ failover (high availability), auto scale storage. Tự cài trên EC2 phải làm hết thủ công, rủi ro mất data cao, tốn thời gian vận hành. Production LUÔN nên dùng RDS. Đắt hơn nhưng đáng giá.

## Q5: Pre-signed URL trong S3 hoạt động thế nào? Tại sao dùng?
**Trả lời:**
Client xin Backend → Backend tạo pre-signed URL từ S3 SDK (có thời hạn, VD 5 phút) → Client upload file TRỰC TIẾP lên S3 bằng URL đó. Backend không cần nhận file → tiết kiệm CPU/RAM/bandwidth server. URL hết hạn → bảo mật. Use case: Upload avatar, ảnh sản phẩm, file đính kèm.

## Q6: Blue-Green vs Canary deployment — khác nhau sao?
**Trả lời:**
- **Blue-Green:** Chạy 2 môi trường song song (Blue=v1, Green=v2). Test Green xong → chuyển Load Balancer sang Green. Rollback: chuyển lại Blue. Nhanh nhưng tốn gấp đôi tài nguyên.
- **Canary:** Chuyển từ từ (5% traffic → v2, 95% → v1). Monitor OK → tăng dần 10% → 50% → 100%. An toàn nhất (chỉ 5% user bị ảnh hưởng nếu bug) nhưng setup phức tạp hơn, cần monitoring tốt.

## Q7: Docker Compose service giao tiếp nhau bằng cách nào?
**Trả lời:**
Docker Compose tự tạo bridge network nội bộ. Các services giao tiếp qua TÊN SERVICE thay vì IP. VD: Backend kết nối PostgreSQL bằng hostname `postgres` (tên service trong docker-compose.yml), port `5432`. Docker DNS resolver tự phân giải tên → IP container. Không bao giờ dùng `localhost` để giao tiếp giữa containers.
