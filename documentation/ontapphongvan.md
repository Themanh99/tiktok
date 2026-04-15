# Danh sách chủ đề ôn tập phỏng vấn Fullstack Developer

> **Cấu trúc:** Mục 1-8 → Frontend | Mục 9-19 → Backend, Database, System Design, Cloud & DevOps

---

# 🎨 PHẦN I — FRONTEND

## 1. HTML & Tối ưu hóa (SEO & Accessibility)
- [x] Semantic HTML và SEO (Search Engine Optimization).
- [x] Canvas vs SVG vs HTML thuần: Khi nào dùng cái nào để vẽ?
- [x] **[Bổ sung]** Sự khác biệt giữa DOM và Virtual DOM.
- [x] **[Bổ sung]** Accessibility (a11y): Các thuộc tính ARIA, tại sao web cần hỗ trợ người khuyết tật.

## 2. CSS & UI
- [x] Các cách Responsive (Mobile first, Desktop first) - Tư duy thiết kế.
- [x] Các thuộc tính căn bản: box-sizing, css units (px, em, rem, vh, vw, %), css selectors, variables.
- [x] Position (static, relative, absolute, fixed, sticky).
- [x] Z-index và Stacking Context (Bối cảnh xếp chồng).
- [x] Flexbox vs Grid: So sánh 2 layout model và các thuộc tính (justify-content, align-items, flex-grow...).
- [x] `visibility: hidden` so với `display: none` và `opacity: 0`.
- [x] **[Bổ sung]** CSS Repaint (Sơn lại) và Reflow (Vẽ lại layout) - Tối ưu hóa render lúc animation (Sử dụng transform vs top/left).
- [x] **[Bổ sung]** Các phương pháp/kiến trúc CSS: BEM, CSS Modules, Styled Components, Utility-first (Tailwind CSS ưu nhược điểm).

## 3. JavaScript Core & Advanced
- [x] Closure trong JS - Đặc biệt là ứng dụng của nó trong React (Ví dụ stale closure trong useEffect).
- [x] Debounce, Throttle và Chunk (Cắt khúc dữ liệu gọi API để tối ưu).
- [x] **[Bổ sung]** Hoisting, Scope Chain và phân biệt `let`, `const`, `var`.
- [x] **[Bổ sung]** Hiểu kỹ về `this`, các hàm `call()`, `bind()`, `apply()`.
- [x] **[Bổ sung]** Event Loop, Call Stack, Microtask, Macrotask (Phân biệt thứ tự chạy của `setTimeout` vs `Promise.then()`).
- [x] **[Bổ sung]** Deep copy vs Shallow copy (Dễ gây lỗi không update UI trong state React nếu copy sai).

## 4. TypeScript (Type Safety)
- [ ] Type vs Interface: Định nghĩa, điểm khác biệt, khi nào dùng cái nào?
- [ ] Định nghĩa và cách sử dụng: Union type, Generic type, Keyword `any` vs `unknown`.
- [ ] **[Bổ sung]** Các Utility Types rất hay bị hỏi: `Record`, `Pick`, `Omit`, `Partial`, `ReturnType`. Cách dùng Tuples. 

## 5. ReactJS (Core & Ecosystem)
- [x] Thời điểm React re-render: Cơ chế Automatic Batching (Ví dụ gọi 5 dòng `setState` liên tiếp thì render mấy lần?).
- [x] `useEffect` vs `useLayoutEffect`: Khác biệt là gì? `useLayoutEffect` có gây chặn trình duyệt làm giảm performance không?
- [ ] Quản lý Form: Form thường (Controlled/Uncontrolled component) vs React Hook Form. Sự khác biệt khi kết hợp form UI (Ant Design) với React Hook Form.
- [ ] Quản lý Data Fetching: TanStack Query (React Query) vs Global State (Redux/Zustand): Có thay thế nhau được không? Phân biệt Client State và Server State.
- [x] **[Bổ sung]** Tối ưu rendering: Phân biệt `React.memo`, `useMemo`, `useCallback` (Dùng nhiều có tốt không?).
- [x] **[Bổ sung]** Quản lý State: React Context API vs Redux vs Zustand: Lúc nào nên dùng cái nào? Khái niệm Prop Drilling.
- [x] **[Bổ sung]** Kiến trúc component: Custom Hooks (Tách logic), HOC (Higher-Order Components). Lấy Ref của con bằng `forwardRef`.

## 6. Performance Optimization (Tối ưu Hiệu Năng Chuyên Sâu)
- [x] Tối ưu hóa Scroll: Web bị scroll giật thì giải pháp là gì (Hardware acceleration bằng CSS `transform: translateZ(0)`, passive event listener).
- [x] Bài toán Render dữ liệu khổng lồ: Xử lý 500k bản ghi hiển thị trên giao diện (Sử dụng kỹ thuật Virtual List / Windowing với `react-window`).
- [x] Các vấn đề về performance gặp trong Frontend? Hãy kể ví dụ thực tế dự án (Ví dụ: Memory Leak do quên clear Event/Interval trong `useEffect` cleanup, Memory Leak vì closure).
- [x] **[Bổ sung]** Code Splitting: `React.lazy` và `Suspense` giúp giảm dung lượng bundle size tải về ban đầu (First Load Time).
- [x] **[Bổ sung]** Kỹ thuật tải nhanh: Lazy Load Image (thuộc tính `loading="lazy"` hoặc Intersection Observer), Tree Shaking (Loại bỏ code thừa).

## 7. Web Architecture, Security & Network
- [x] Phân biệt LocalStorage, SessionStorage và Cookie.
- [x] Security Web: Lỗ hổng XSS, CSRF, và CORS hiểu sâu để né.
- [x] Micro Frontend: Kiến trúc này là gì? Ưu nhược điểm so với Monolith App truyền thống.
- [ ] **[Bổ sung]** Giao thức mạng: HTTP/1.1 vs HTTP/2 (Đặc biệt HTTP/2 Multiplexing giúp load các file js/css nhanh hơn). 
- [ ] **[Bổ sung]** API Design: RESTful API vs GraphQL (Sự khác biệt khi gọi data, Underfetching vs Overfetching).
- [ ] **[Bổ sung]** Xác thực Auth: Cấu trúc JWT Token (Header, Payload, Signature) và cơ chế Refresh Token Flow an toàn.

## 8. Git & Workflow (Kỹ năng Teamwork)
- [x] Git Flow: Phân biệt `git rebase` và `git merge`. So sánh khi nào nên dùng lệnh nào? Cách Resolve conflict OKE, an toàn như nào.
- [ ] **[Bổ sung]** CI/CD cơ bản (GitHub Actions, GitLab CI): Tại sao dự án lớn lại phải setup quy trình auto build/deploy tự động và chạy Lint/Test lúc tạo Pull Request.

---

# ⚙️ PHẦN II — BACKEND & SYSTEM DESIGN

## 9. Node.js Core & Runtime
- [ ] Node.js là gì? Tại sao chọn Node.js cho Backend (Non-blocking I/O, Single-threaded Event Loop, libuv).
- [ ] Event Loop trong Node.js vs Browser: Giống và khác nhau gì? Các phase của Event Loop Node (timers → pending → idle → poll → check → close).
- [ ] Module System: CommonJS (`require/module.exports`) vs ES Modules (`import/export`). Khi nào dùng cái nào?
- [ ] Stream & Buffer: Xử lý dữ liệu lớn (upload file, đọc file GB) mà không tốn bộ nhớ. Phân biệt 4 loại stream (Readable, Writable, Duplex, Transform).
- [ ] Cluster & Worker Threads: Scale Node.js lên nhiều CPU core. PM2 cluster mode trong production.
- [ ] Error Handling: Xử lý lỗi trong async/await (try-catch vs middleware), Unhandled Promise Rejection, Graceful Shutdown.
- [ ] **[Bổ sung]** Express.js / NestJS: Middleware pipeline, Guards, Interceptors, Pipes (NestJS). Phân biệt Express (minimal) vs NestJS (opinionated, dùng Decorator + DI).

## 10. OOP — Lập trình hướng đối tượng
- [ ] 4 tính chất OOP: **Encapsulation** (Đóng gói), **Inheritance** (Kế thừa), **Polymorphism** (Đa hình), **Abstraction** (Trừu tượng). Cho ví dụ thực tế.
- [ ] SOLID Principles — 5 nguyên tắc thiết kế:
  - [ ] **S** — Single Responsibility: Mỗi class chỉ làm 1 nhiệm vụ.
  - [ ] **O** — Open/Closed: Mở rộng được nhưng không sửa code cũ.
  - [ ] **L** — Liskov Substitution: Class con thay thế class cha mà không gây lỗi.
  - [ ] **I** — Interface Segregation: Chia nhỏ interface, đừng ép implement cái không cần.
  - [ ] **D** — Dependency Inversion: Phụ thuộc vào abstraction, không phụ thuộc vào implementation cụ thể (Ví dụ: Dependency Injection trong NestJS).
- [ ] Class vs Prototype trong JavaScript/TypeScript: JS thực chất dùng Prototypal Inheritance, `class` chỉ là syntactic sugar.
- [ ] Abstract Class vs Interface (trong TypeScript): Khi nào dùng cái nào?

## 11. Design Patterns (Mẫu thiết kế)
- [ ] **Creational Patterns** (Khởi tạo):
  - [ ] Singleton: Đảm bảo chỉ có 1 instance (Ví dụ: Database connection pool, Logger).
  - [ ] Factory Method: Tạo object mà không cần biết class cụ thể (Ví dụ: tạo Payment processor theo loại Momo/VNPay/Stripe).
  - [ ] Builder: Xây dựng object phức tạp từng bước (Ví dụ: Query builder).
- [ ] **Structural Patterns** (Cấu trúc):
  - [ ] Adapter: Chuyển đổi interface không tương thích (Ví dụ: wrap thư viện bên thứ 3).
  - [ ] Decorator: Thêm behavior mà không sửa class gốc (Ví dụ: `@UseGuards()` trong NestJS).
  - [ ] Proxy: Kiểm soát truy cập đến object (Ví dụ: Caching proxy, Logging proxy).
- [ ] **Behavioral Patterns** (Hành vi):
  - [ ] Observer: Cơ chế pub/sub cho event (Ví dụ: EventEmitter trong Node.js, Redux store subscribe).
  - [ ] Strategy: Đổi thuật toán linh hoạt lúc runtime (Ví dụ: chọn chiến lược sort, pricing).
  - [ ] Repository Pattern: Tách biệt logic truy vấn DB khỏi business logic (Rất quan trọng trong NestJS/TypeORM).

## 12. RESTful API Design & Best Practices
- [ ] REST là gì? 6 ràng buộc (Constraints) của REST: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code on Demand.
- [ ] Thiết kế URL đúng chuẩn: Noun-based (`/users/{id}/orders`), không dùng verb trong URL. Versioning API (`/v1/`, `/v2/`).
- [ ] HTTP Methods đúng ngữ nghĩa: `GET` (đọc), `POST` (tạo), `PUT` (thay thế hoàn toàn), `PATCH` (cập nhật 1 phần), `DELETE` (xóa). Idempotent là gì?
- [ ] HTTP Status Codes cần nhớ: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`, `502`, `503`.
- [ ] Pagination: Offset-based (`?page=2&limit=20`) vs Cursor-based (dùng `cursor` cho infinite scroll). Ưu nhược điểm từng cách.
- [ ] Error Response chuẩn: Cấu trúc JSON error response thống nhất (`{ code, message, details }`).
- [ ] **[Bổ sung]** Rate Limiting & Throttling: Bảo vệ API khỏi bị spam/DDoS (Token bucket, Sliding window). Dùng thư viện `express-rate-limit` hoặc API Gateway.
- [ ] **[Bổ sung]** API Documentation: Swagger/OpenAPI — Tại sao phải viết docs chuẩn? Cách tích hợp `@nestjs/swagger` tự động generate docs từ DTO.

## 13. Database (SQL & NoSQL)
- [ ] **SQL (Relational DB — PostgreSQL/MySQL):**
  - [ ] Normalization (1NF → 3NF): Tại sao phải chuẩn hóa dữ liệu? Khi nào nên Denormalization (đánh đổi tốc độ đọc)?
  - [ ] JOIN các loại: `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`, `CROSS JOIN`. Viết query thực tế.
  - [ ] Index (Chỉ mục): B-Tree Index vs Hash Index. Composite Index. Tại sao thêm Index tăng tốc SELECT nhưng lại chậm INSERT/UPDATE?
  - [ ] Transaction & ACID: Atomicity, Consistency, Isolation, Durability. Transaction Isolation Levels (Read Uncommitted → Serializable).
  - [ ] Query Optimization: `EXPLAIN ANALYZE` để đọc query plan. N+1 Query Problem và cách fix (Eager Loading, Data Loader).
  - [ ] Stored Procedure vs Function vs Trigger: Khi nào nên dùng logic ở DB layer?
- [ ] **NoSQL (MongoDB/DynamoDB):**
  - [ ] Document-based vs Key-Value vs Column-family vs Graph DB: Phân biệt và use case từng loại.
  - [ ] MongoDB: Embedded Document vs Reference (tương tự JOIN). Khi nào embed, khi nào ref?
  - [ ] CAP Theorem: Consistency, Availability, Partition Tolerance — Chỉ chọn được 2/3. Ví dụ: MongoDB chọn CP, Cassandra chọn AP.
- [ ] **[Bổ sung]** ORM/ODM: TypeORM, Prisma, Mongoose — Ưu nhược điểm. Raw query vs ORM khi nào dùng cái nào?
- [ ] **[Bổ sung]** Database Migration: Tại sao phải dùng migration thay vì chỉnh tay DB? Tools: Prisma Migrate, TypeORM Migration, Flyway.

## 14. Caching — Redis & Memcached
- [ ] **Redis:**
  - [ ] Redis là gì? In-memory data store. Các data structure: String, Hash, List, Set, Sorted Set, Stream.
  - [ ] Caching Strategies: **Cache-Aside** (Lazy Loading), **Write-Through**, **Write-Behind** (Write-Back), **Read-Through**. Ưu nhược điểm từng loại.
  - [ ] Cache Invalidation: TTL (Time To Live), Manual Invalidation, Event-driven invalidation. Câu nổi tiếng: "Cache invalidation is one of the hardest things in CS".
  - [ ] Redis Pub/Sub: Giao tiếp giữa các service realtime (Ví dụ: notification, chat).
  - [ ] Redis Sentinel vs Redis Cluster: High Availability vs Horizontal Scaling.
  - [ ] Use case thực tế: Session store, Rate limiting, Leaderboard (Sorted Set), Queue đơn giản (List LPUSH/BRPOP).
- [ ] **Memcached:**
  - [ ] Memcached vs Redis: Memcached đơn giản hơn (chỉ key-value string), multi-threaded (tận dụng multi-core tốt hơn), không persistent.
  - [ ] Khi nào chọn Memcached thay Redis? (Cache đơn giản, object caching, session store scale lớn, không cần data structure phức tạp).
- [ ] **[Bổ sung]** Cache Penetration, Cache Breakdown, Cache Avalanche: 3 vấn đề kinh điển của caching và cách giải quyết (Bloom Filter, Mutex Lock, Random TTL).

## 15. Message Queue & Kafka
- [ ] **Message Queue là gì?** Tại sao cần? (Decouple services, async processing, load leveling, retry mechanism).
- [ ] **Apache Kafka:**
  - [ ] Kiến trúc Kafka: Broker, Topic, Partition, Consumer Group, Offset. Tại sao Kafka nhanh? (Sequential I/O, Zero-copy, Batch compression).
  - [ ] Producer & Consumer: Ack levels (`acks=0`, `acks=1`, `acks=all`). Consumer Group rebalancing.
  - [ ] Kafka vs RabbitMQ vs SQS: So sánh use case. Kafka = Event streaming (log, analytics, real-time). RabbitMQ = Task queue (email, notification). SQS = Serverless queue trên AWS.
  - [ ] Exactly-once delivery: Kafka hỗ trợ idempotent producer + transactional consumer. Tại sao "exactly-once" khó?
  - [ ] Use case thực tế: Event sourcing, Log aggregation, Real-time analytics pipeline, CDC (Change Data Capture).
- [ ] **[Bổ sung]** Dead Letter Queue (DLQ): Xử lý message bị lỗi liên tục thì đẩy vào DLQ để debug/retry sau.
- [ ] **[Bổ sung]** Event-driven Architecture: Sự khác biệt giữa Event Notification, Event-Carried State Transfer, Event Sourcing, và CQRS.

## 16. Microservices Architecture
- [ ] Monolith vs Microservices: Ưu nhược điểm. Khi nào nên chuyển từ monolith sang microservices? (Đừng dùng microservices cho dự án nhỏ!)
- [ ] Communication giữa services:
  - [ ] Synchronous: REST, gRPC (Protocol Buffers — nhanh hơn JSON). Khi nào dùng gRPC thay REST?
  - [ ] Asynchronous: Message Queue (Kafka, RabbitMQ). Event-driven communication.
- [ ] Service Discovery: Các service tìm nhau bằng cách nào? (DNS-based, Consul, Eureka, hoặc Kubernetes Service).
- [ ] API Gateway: Tại sao cần 1 điểm vào duy nhất? (Routing, Auth, Rate limiting, Load balancing). Tools: Kong, AWS API Gateway, Nginx.
- [ ] Circuit Breaker Pattern: Ngăn chặn cascading failure khi 1 service chết (Ví dụ: Resilience4j, Polly). Trạng thái: Closed → Open → Half-Open.
- [ ] Distributed Transaction: Saga Pattern (Choreography vs Orchestration). Tại sao không dùng 2PC (Two-Phase Commit) trong microservices?
- [ ] **[Bổ sung]** Database per Service: Mỗi service có DB riêng. Vấn đề data consistency giải quyết bằng Eventual Consistency + Event Sourcing.
- [ ] **[Bổ sung]** Observability: Logging (ELK Stack), Monitoring (Prometheus + Grafana), Tracing (Jaeger, OpenTelemetry). Tại sao microservices BẮT BUỘC phải có?

## 17. AWS Cloud Services
- [ ] **Compute:**
  - [ ] EC2: Virtual server. Instance types (t3.micro vs c5.xlarge). Auto Scaling Group + Load Balancer (ALB vs NLB).
  - [ ] Lambda: Serverless functions. Cold start problem. Khi nào dùng Lambda vs EC2?
  - [ ] ECS/EKS: Container orchestration (Docker container trên AWS). Fargate (serverless container) vs EC2 launch type.
- [ ] **Storage:**
  - [ ] S3: Object storage cho file/image/video. Bucket Policy, Pre-signed URL (upload trực tiếp từ client). Storage classes (Standard, IA, Glacier).
  - [ ] RDS: Managed SQL database (PostgreSQL, MySQL). Multi-AZ (High Availability) vs Read Replicas (Scale đọc).
  - [ ] DynamoDB: Managed NoSQL. Partition Key, Sort Key, GSI (Global Secondary Index). On-demand vs Provisioned capacity.
  - [ ] ElastiCache: Managed Redis/Memcached trên AWS.
- [ ] **Networking & Security:**
  - [ ] VPC: Virtual Private Cloud. Public Subnet vs Private Subnet. NAT Gateway. Security Groups vs NACL.
  - [ ] Route 53: DNS service. Routing policies (Simple, Weighted, Latency-based, Failover).
  - [ ] CloudFront: CDN — Cache static assets ở edge locations gần user.
  - [ ] IAM: Users, Roles, Policies. Principle of Least Privilege. Assume Role.
- [ ] **[Bổ sung]** SQS & SNS: SQS (Queue — point-to-point) vs SNS (Topic — pub/sub). Kết hợp: SNS fanout → multiple SQS queues.
- [ ] **[Bổ sung]** CloudWatch: Logs, Metrics, Alarms. Thiết lập alert khi CPU > 80% hoặc error rate tăng đột biến.

## 18. DevOps, CI/CD & Infrastructure
- [ ] **Docker:**
  - [ ] Dockerfile best practices: Multi-stage build, layer caching, `.dockerignore`, non-root user.
  - [ ] Docker Compose: Chạy multi-container local (app + db + redis). `depends_on`, health check, volumes.
  - [ ] Docker Networking: Bridge, Host, Overlay. Container giao tiếp nhau bằng tên service.
- [ ] **Kubernetes (K8s) cơ bản:**
  - [ ] Pod, Deployment, Service, Ingress: Các concept cốt lõi.
  - [ ] Horizontal Pod Autoscaler (HPA): Auto scale dựa trên CPU/Memory.
  - [ ] ConfigMap & Secret: Quản lý config và credentials an toàn.
  - [ ] Helm Charts: Package manager cho K8s. Tại sao cần?
- [ ] **CI/CD Pipeline:**
  - [ ] Các stages chuẩn: Lint → Test → Build → Deploy. Branch strategy (GitFlow, Trunk-based development).
  - [ ] GitHub Actions / GitLab CI / Jenkins: So sánh. Viết pipeline YAML cơ bản.
  - [ ] Blue-Green Deployment vs Canary Deployment vs Rolling Update: Chiến lược deploy không downtime.
- [ ] **Infrastructure as Code (IaC):**
  - [ ] Terraform: Khai báo infrastructure bằng code (VPC, EC2, RDS...). State file, Plan, Apply, Destroy.
  - [ ] AWS CDK / CloudFormation: IaC native của AWS.
- [ ] **[Bổ sung]** Nginx: Reverse Proxy, Load Balancer, SSL Termination, Static file serving. Config cơ bản.
- [ ] **[Bổ sung]** Monitoring & Alerting: Prometheus + Grafana stack. Thiết kế dashboard cho production. PagerDuty/OpsGenie cho on-call.

## 19. POS — Point of Sale System (Domain Knowledge)
- [ ] POS là gì? Hệ thống bán hàng tại điểm bán (Retail, F&B, Pharmacy...). Các module chính: Quản lý sản phẩm, Đơn hàng, Thanh toán, Kho, Báo cáo.
- [ ] Luồng nghiệp vụ cốt lõi:
  - [ ] **Order Flow**: Tạo đơn → Thêm sản phẩm → Áp khuyến mãi/voucher → Tính thuế (VAT) → Thanh toán → In hóa đơn (receipt).
  - [ ] **Inventory Management**: Nhập kho, Xuất kho, Kiểm kê (stocktake). Quản lý tồn kho real-time khi bán hàng.
  - [ ] **Payment Methods**: Tiền mặt, Chuyển khoản, Thẻ (POS terminal), Ví điện tử (Momo, ZaloPay, VNPay). Tích hợp Payment Gateway.
- [ ] Xử lý Offline: POS phải hoạt động khi mất mạng (Offline-first architecture). Sync data lên server khi có mạng lại (Conflict resolution strategy).
- [ ] Hiệu năng & UX: Thanh toán phải nhanh (< 2 giây). Giao diện tối ưu cho nhân viên thu ngân (Touch-friendly, phím tắt, barcode scanner).
- [ ] Multi-store & Multi-tenant: Hệ thống POS cho chuỗi cửa hàng. Phân quyền theo chi nhánh (Branch-based RBAC).
- [ ] **[Bổ sung]** Tích hợp phần cứng: Máy in hóa đơn (receipt printer — ESC/POS protocol), Máy quét mã vạch (barcode/QR scanner), Ngăn kéo tiền (cash drawer), Màn hình hiển thị khách hàng.
- [ ] **[Bổ sung]** Báo cáo & Analytics: Doanh thu theo ngày/tháng, Top sản phẩm bán chạy, Lợi nhuận gộp, Báo cáo ca làm việc (shift report). Dashboard real-time.

---
*Ghi chú: Các mục [x] là đã nắm vững, mục [ ] là cần ôn tập. **[Bổ sung]** là các kiến thức nâng cao quan trọng. Tài liệu này bao phủ đủ kiến thức cho vị trí **Fullstack Developer (Mid/Senior)** — từ Frontend (React/TypeScript) đến Backend (Node.js/NestJS), Database, System Design, Cloud (AWS), và DevOps.*