# PostgreSQL & Database — Kiến Thức Chuyên Sâu (Mid/Senior)

> Tài liệu này bao gồm kiến thức nền tảng cần học trước, sau đó là các câu hỏi phỏng vấn kèm câu trả lời chi tiết.

---

# PHẦN A — KIẾN THỨC NỀN TẢNG CẦN HỌC

---

## I. Relational Database Fundamentals (Cơ sở RDBMS)

### 1.1 Relational Database là gì?
Relational Database (Cơ sở dữ liệu quan hệ) lưu trữ dữ liệu trong các **bảng (tables)**. Mỗi bảng có hàng (rows) và cột (columns). Các bảng liên kết với nhau thông qua **khóa (keys)**.

**Các loại khóa:**
- **Primary Key (Khóa chính):** Định danh duy nhất cho mỗi row. Mỗi bảng chỉ có 1 PK. Không được NULL, không được trùng.
- **Foreign Key (Khóa ngoại):** Cột tham chiếu đến Primary Key của bảng khác, tạo mối quan hệ giữa 2 bảng.
- **Unique Key:** Đảm bảo giá trị trong cột/nhóm cột không trùng nhau (nhưng cho phép NULL).
- **Composite Key:** Primary Key gồm nhiều cột kết hợp (VD: bảng `order_items` dùng PK gồm `order_id` + `product_id`).

### 1.2 Các mối quan hệ (Relationships)

```
┌─────────────────────────────────────────────────────┐
│  ONE-TO-ONE (1-1)                                    │
│  User ──── UserProfile                              │
│  Mỗi user có 1 profile duy nhất                     │
│  FK đặt ở bảng phụ: profiles.user_id → users.id    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ONE-TO-MANY (1-N)                                   │
│  User ──┬── Order                                   │
│         ├── Order                                   │
│         └── Order                                   │
│  1 user có nhiều orders                              │
│  FK đặt ở bảng "nhiều": orders.user_id → users.id  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  MANY-TO-MANY (N-N)                                  │
│  Student ──┬──┬── Course                            │
│            │  │                                      │
│  Cần bảng trung gian (Junction Table)                │
│  student_courses: student_id + course_id            │
└─────────────────────────────────────────────────────┘
```

**Ví dụ SQL tạo quan hệ:**
```sql
-- Bảng users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bảng orders (1 user có nhiều orders → ONE-TO-MANY)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ON DELETE CASCADE: Khi xóa user → tự xóa tất cả orders của user đó
-- ON DELETE SET NULL: Khi xóa user → orders.user_id = NULL (giữ order nhưng mất liên kết)
-- ON DELETE RESTRICT: Nếu user còn orders → CẤM xóa user (báo lỗi)
```

### 1.3 Normalization (Chuẩn hóa dữ liệu)
Normalization là quá trình thiết kế bảng sao cho **loại bỏ dữ liệu trùng lặp** và **đảm bảo tính nhất quán**.

**1NF (First Normal Form):**
- Mỗi cell chỉ chứa 1 giá trị duy nhất (không chứa mảng/list).
- Mỗi row phải khác nhau (có Primary Key).
```
❌ Vi phạm 1NF:
| id | name  | phones                    |
|----|-------|---------------------------|
| 1  | Alice | 0901234567, 0987654321    |  ← 2 số trong 1 ô

✅ Đạt 1NF:
| id | name  | phone      |
|----|-------|------------|
| 1  | Alice | 0901234567 |
| 1  | Alice | 0987654321 |  ← Hoặc tạo bảng phones riêng
```

**2NF (Second Normal Form):**
- Đạt 1NF + mọi cột phụ thuộc TOÀN BỘ vào Primary Key (không phụ thuộc 1 phần).
```
❌ Vi phạm 2NF (PK là composite: order_id + product_id):
| order_id | product_id | product_name | quantity |
|----------|------------|--------------|----------|
| 1        | 101        | iPhone       | 2        |
// product_name chỉ phụ thuộc product_id, KHÔNG phụ thuộc order_id

✅ Đạt 2NF: Tách bảng products ra riêng
orders_items: order_id, product_id, quantity
products: product_id, product_name
```

**3NF (Third Normal Form):**
- Đạt 2NF + không có phụ thuộc bắc cầu (transitive dependency).
```
❌ Vi phạm 3NF:
| employee_id | department_id | department_name |
|-------------|---------------|-----------------|
// department_name phụ thuộc department_id, không phụ thuộc trực tiếp employee_id

✅ Đạt 3NF: Tách bảng departments
employees: employee_id, department_id
departments: department_id, department_name
```

**Khi nào Denormalization (phi chuẩn hóa)?**
- Khi cần tối ưu tốc độ ĐỌC. Mỗi JOIN giữa các bảng đều tốn thời gian. Nếu hệ thống đọc nhiều hơn ghi (VD: báo cáo/analytics), có thể lưu dư (duplicate) data để tránh JOIN.
- Ví dụ: Lưu `total_items` trong bảng `orders` thay vì phải COUNT từ `order_items` mỗi lần query.
- Trade-off: Tốc độ đọc nhanh hơn ↔ Ghi phức tạp hơn (phải cập nhật nhiều nơi), nguy cơ data không đồng bộ.

### 1.4 JOINs — Phép nối bảng

```sql
-- Dữ liệu mẫu:
-- users: (1, 'Alice'), (2, 'Bob'), (3, 'Charlie')
-- orders: (101, user_id=1, 500k), (102, user_id=1, 300k), (103, user_id=2, 700k)
-- Note: Charlie (id=3) KHÔNG có order nào

-- ─── INNER JOIN ───
-- Chỉ lấy rows có MATCH ở CẢ HAI bảng
SELECT u.name, o.id AS order_id, o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
-- Kết quả: Alice(101, 500k), Alice(102, 300k), Bob(103, 700k)
-- Charlie KHÔNG xuất hiện vì không có order

-- ─── LEFT JOIN (LEFT OUTER JOIN) ───
-- Lấy TẤT CẢ rows bảng trái + match bảng phải (NULL nếu không match)
SELECT u.name, o.id AS order_id, o.total_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
-- Kết quả: Alice(101, 500k), Alice(102, 300k), Bob(103, 700k), Charlie(NULL, NULL)
-- Charlie xuất hiện với order = NULL

-- Use case thực tế: "Liệt kê TẤT CẢ users, kèm orders nếu có"
-- → Dùng LEFT JOIN vì muốn hiện cả users chưa mua hàng

-- ─── RIGHT JOIN ───
-- Ngược lại LEFT JOIN: lấy tất cả bảng phải
-- Ít dùng vì đổi thứ tự bảng + LEFT JOIN cho kết quả giống nhau

-- ─── FULL OUTER JOIN ───
-- Lấy TẤT CẢ rows từ CẢ HAI bảng
SELECT u.name, o.id
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
-- Nếu có orphan order (user bị xóa) → cũng xuất hiện

-- ─── CROSS JOIN ───
-- Tích Descartes: mỗi row bảng A ghép với TOÀN BỘ rows bảng B
-- 3 users × 3 orders = 9 rows
-- Use case: Tạo combo matrix (VD: size × color cho products)
SELECT s.name AS size, c.name AS color
FROM sizes s CROSS JOIN colors c;
```

---

## II. Indexing (Chỉ mục) — Kiến Thức Cốt Lõi

### 2.1 Index là gì?
Index là một **cấu trúc dữ liệu phụ trợ** được tạo song song bên cạnh bảng chính, dùng để tăng tốc quá trình tìm kiếm dữ liệu. Giống mục lục sách: thay vì đọc từng trang để tìm chủ đề, bạn tra mục lục để biết trang chính xác.

### 2.2 B-Tree Index (Loại mặc định trong PostgreSQL)

```
                    ┌──────┐
                    │  50  │              ← Root Node
                    └──┬───┘
              ┌────────┴────────┐
         ┌────┴───┐        ┌───┴────┐
         │ 20, 35 │        │ 70, 85 │    ← Internal Nodes
         └──┬──┬──┘        └──┬──┬──┘
       ┌────┘  └────┐    ┌───┘  └───┐
  ┌────┴───┐  ┌────┴┐  ┌┴────┐  ┌──┴───┐
  │ 5,10,15│  │25,30│  │55,60│  │75,80 │  ← Leaf Nodes (trỏ tới row thật)
  └────────┘  └─────┘  └─────┘  └──────┘
```

**Cách hoạt động:**
- B-Tree (Balanced Tree) duy trì cây cân bằng. Mọi leaf node có cùng độ sâu.
- Khi tìm `WHERE email = 'alice@gmail.com'`:
  - **Không có Index:** Quét lần lượt TỪNG ROW trong bảng (Full Table Scan). Bảng 1 triệu rows → kiểm tra 1 triệu lần. Độ phức tạp O(n).
  - **Có B-Tree Index trên cột email:** Bắt đầu từ root, so sánh và rẽ nhánh. Chỉ cần ~20 lần so sánh cho bảng 1 triệu rows (log₂(1,000,000) ≈ 20). Độ phức tạp O(log n).
- B-Tree hỗ trợ cả phép so sánh khoảng: `<`, `>`, `<=`, `>=`, `BETWEEN`, `ORDER BY`.

```sql
-- Tạo index
CREATE INDEX idx_users_email ON users(email);

-- Composite Index (chỉ mục tổ hợp) — nhiều cột
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- ⚠️ THỨ TỰ CỘT RẤT QUAN TRỌNG (leftmost prefix rule):
-- idx(user_id, status) hỗ trợ:
--   WHERE user_id = 1                    ✅ (dùng cột đầu tiên)
--   WHERE user_id = 1 AND status = 'paid' ✅ (dùng cả 2 cột)
--   WHERE status = 'paid'                ❌ (chỉ dùng cột 2 → KHÔNG dùng index!)

-- Unique Index — vừa index vừa đảm bảo unique
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Partial Index — chỉ index rows thỏa điều kiện
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
-- Chỉ index users đang active → index nhỏ hơn, nhanh hơn

-- Expression Index — index trên biểu thức
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
-- Hỗ trợ: WHERE LOWER(email) = 'alice@gmail.com'
```

### 2.3 Các loại Index khác trong PostgreSQL

```sql
-- ─── Hash Index ───
-- Chỉ hỗ trợ phép = (equality). Không hỗ trợ range, ORDER BY.
-- Nhanh hơn B-Tree một chút cho equality nhưng ít linh hoạt.
CREATE INDEX idx_users_id_hash ON users USING hash(id);

-- ─── GIN Index (Generalized Inverted Index) ───
-- Dành cho full-text search, JSONB, Array
CREATE INDEX idx_products_tags ON products USING gin(tags);
-- Hỗ trợ: WHERE tags @> '{electronics}' (mảng chứa phần tử)

-- Dành cho tìm kiếm text tiếng Việt/Anh:
CREATE INDEX idx_products_search ON products
  USING gin(to_tsvector('english', name || ' ' || description));
-- Hỗ trợ: WHERE to_tsvector('english', name || ' ' || description) @@ to_tsquery('iphone')

-- ─── GiST Index ───
-- Dành cho geometric data, range queries, full-text search
-- VD: Tìm cửa hàng gần vị trí GPS

-- ─── BRIN Index (Block Range Index) ───
-- Siêu nhẹ, dành cho bảng CỰC LỚN có dữ liệu tự nhiên tăng dần (VD: timestamp, serial ID)
CREATE INDEX idx_logs_created ON logs USING brin(created_at);
-- Bảng 100 triệu rows log → BRIN index chỉ vài KB (thay vì hàng trăm MB với B-Tree)
```

### 2.4 Khi nào Index KHÔNG có tác dụng?

```sql
-- 1. Dùng hàm trên cột có index (trừ khi có Expression Index)
WHERE UPPER(name) = 'ALICE'        -- ❌ Index trên name bị bỏ qua
WHERE LOWER(email) = 'a@gmail.com' -- ❌ Trừ khi có index trên LOWER(email)

-- 2. LIKE với wildcard ở đầu
WHERE name LIKE '%alice'           -- ❌ Full Table Scan
WHERE name LIKE 'alice%'           -- ✅ Dùng được B-Tree Index

-- 3. Cột có quá ít giá trị khác nhau (low cardinality / low selectivity)
WHERE gender = 'male'              -- ❌ 50% rows match → DB chọn Full Scan nhanh hơn Index

-- 4. Bảng quá nhỏ (vài trăm rows)
-- DB scan toàn bộ bảng nhỏ nhanh hơn đi qua cây Index

-- 5. Sử dụng OR không đúng cách
WHERE email = 'a@g.com' OR phone = '090...' 
-- Cần 2 index riêng, hoặc dùng UNION thay OR

-- 6. Type mismatch (kiểu dữ liệu không khớp)
WHERE id = '123' -- id là integer, '123' là string → có thể bỏ qua index
```

### 2.5 Trade-off của Index (Write Penalty)
```
┌─────────────────────────────────────────────────────────────┐
│                    TRADE-OFF OF INDEXES                      │
│                                                              │
│  READ (SELECT):  ████████████████████ NHANH hơn rất nhiều   │
│                                                              │
│  WRITE (INSERT): ████████ CHẬM hơn (phải cập nhật B-Tree)   │
│  WRITE (UPDATE): ████████ CHẬM hơn (cập nhật row + indexes) │
│  WRITE (DELETE): ████████ CHẬM hơn (xóa row + cleanup tree) │
│                                                              │
│  STORAGE:        ████████ Tốn thêm dung lượng ổ đĩa         │
│                                                              │
│  Quy tắc: Đừng đánh Index bừa bãi!                          │
│  - Chỉ index cột hay dùng trong WHERE, JOIN, ORDER BY       │
│  - Bảng ghi nhiều hơn đọc → cẩn thận với số lượng index     │
│  - Dùng EXPLAIN ANALYZE để kiểm tra index có thực sự dùng   │
└─────────────────────────────────────────────────────────────┘
```

---

## III. Transactions & ACID

### 3.1 Transaction là gì?
Transaction là một nhóm các câu lệnh SQL được thực thi như **một đơn vị duy nhất**. Tất cả phải thành công, hoặc tất cả bị hủy (rollback). Không có chuyện thực hiện nửa vời.

```sql
-- Ví dụ: Chuyển 500k từ Alice sang Bob
BEGIN; -- Bắt đầu transaction

  UPDATE accounts SET balance = balance - 500000 WHERE user_id = 1; -- Trừ tiền Alice
  UPDATE accounts SET balance = balance + 500000 WHERE user_id = 2; -- Cộng tiền Bob

  -- Nếu dòng 2 bị lỗi (VD: Bob account bị khóa):
  -- ROLLBACK → Dòng 1 cũng bị hủy → Alice không mất tiền
  -- Nếu cả 2 thành công:

COMMIT; -- Xác nhận giao dịch, lưu vĩnh viễn
```

### 3.2 ACID — 4 Tính Chất Bất Di Bất Dịch của Transaction

**A — Atomicity (Nguyên tử):**
Transaction là "tất cả hoặc không gì". Nếu bất kỳ bước nào trong transaction fail, TOÀN BỘ sẽ bị rollback về trạng thái trước khi BEGIN. 

Ví dụ thực tế: Checkout đơn hàng e-commerce gồm 4 bước:
1. Trừ tiền ví khách hàng
2. Tạo đơn hàng
3. Trừ tồn kho sản phẩm
4. Ghi log transaction

Nếu bước 3 fail (hết hàng) → Bước 1 và 2 cũng bị rollback. Tiền trả lại ví khách.

**C — Consistency (Nhất quán):**
Transaction phải đưa database từ trạng thái hợp lệ này sang trạng thái hợp lệ khác. Mọi constraint (foreign key, unique, check) phải được thỏa mãn trước và sau transaction.

Ví dụ: Nếu balance có constraint `CHECK (balance >= 0)`:
```sql
BEGIN;
  UPDATE accounts SET balance = balance - 1000000 WHERE user_id = 1;
  -- Nếu balance hiện tại = 500k → balance = -500k → vi phạm CHECK constraint
  -- → Transaction fail → Rollback
COMMIT;
```

**I — Isolation (Cô lập):**
Nhiều transaction chạy đồng thời phải được cô lập — transaction A không nhìn thấy data "đang sửa dở" của transaction B. Mức độ cô lập có thể điều chỉnh (xem phần Isolation Levels bên dưới).

**D — Durability (Bền vững):**
Khi transaction đã COMMIT thành công, data đã được ghi vĩnh viễn vào ổ cứng. Dù server mất điện, crash, restart → data vẫn còn nguyên. PostgreSQL đảm bảo bằng WAL (Write-Ahead Logging): ghi log trước khi ghi data thật.

### 3.3 Transaction Isolation Levels (Mức độ cô lập)

Khi 2 transaction chạy ĐỒNG THỜI trên cùng dữ liệu, có thể xảy ra các vấn đề:

**Dirty Read (Đọc bẩn):**
```
Transaction A                    Transaction B
─────────────                    ─────────────
BEGIN;                           BEGIN;
UPDATE users SET name='Bob'
  WHERE id=1;
                                 SELECT name FROM users WHERE id=1;
                                 → Đọc được 'Bob' (CHƯA COMMIT!)
ROLLBACK; ← Hủy!
                                 → Data 'Bob' vừa đọc là RÁC!
```

**Non-Repeatable Read (Đọc không lặp lại):**
```
Transaction A                    Transaction B
─────────────                    ─────────────
BEGIN;
SELECT balance FROM accounts WHERE id=1;
→ 1,000,000
                                 BEGIN;
                                 UPDATE accounts SET balance=500000
                                   WHERE id=1;
                                 COMMIT;
SELECT balance FROM accounts WHERE id=1;
→ 500,000     ← Khác lần đầu! Cùng 1 query trong 1 transaction mà ra 2 kết quả!
```

**Phantom Read (Đọc ảo):**
```
Transaction A                    Transaction B
─────────────                    ─────────────
BEGIN;
SELECT COUNT(*) FROM orders WHERE status='pending';
→ 5 orders
                                 BEGIN;
                                 INSERT INTO orders (status) VALUES ('pending');
                                 COMMIT;
SELECT COUNT(*) FROM orders WHERE status='pending';
→ 6 orders    ← Xuất hiện thêm row "ma" (phantom) mà A không insert!
```

**4 Isolation Levels và protection:**

| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |
|---|---|---|---|---|
| **Read Uncommitted** | ❌ Có thể xảy ra | ❌ Có thể | ❌ Có thể | Nhanh nhất |
| **Read Committed** (PG default) | ✅ Ngăn được | ❌ Có thể | ❌ Có thể | Nhanh |
| **Repeatable Read** | ✅ Ngăn được | ✅ Ngăn được | ❌ Có thể* | Trung bình |
| **Serializable** | ✅ Ngăn được | ✅ Ngăn được | ✅ Ngăn được | Chậm nhất |

*Lưu ý: PostgreSQL implement Repeatable Read bằng MVCC (Multi-Version Concurrency Control) nên thực tế cũng ngăn được Phantom Read, khác với chuẩn SQL lý thuyết.*

```sql
-- Đặt isolation level cho transaction hiện tại
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  SELECT * FROM accounts WHERE id = 1;
  -- ... logic xử lý ...
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Đặt isolation level mặc định cho session
SET default_transaction_isolation = 'serializable';
```

**Khi nào dùng level nào?**
- **Read Committed (mặc định):** Phù hợp 90% ứng dụng web CRUD thông thường.
- **Repeatable Read:** Báo cáo tài chính, thống kê cần data nhất quán trong suốt quá trình tính toán.
- **Serializable:** Giao dịch tài chính cực kỳ nhạy cảm (chuyển khoản ngân hàng, thanh toán). Chấp nhận chậm để đổi lấy chính xác tuyệt đối.

### 3.4 PostgreSQL MVCC (Multi-Version Concurrency Control)
PostgreSQL KHÔNG dùng lock truyền thống cho read. Thay vào đó, nó dùng cơ chế MVCC:
- Mỗi row có 2 "nhãn thời gian" ẩn: `xmin` (transaction ID tạo ra) và `xmax` (transaction ID xóa/update).
- Khi UPDATE, PostgreSQL KHÔNG sửa row cũ. Nó tạo bản sao mới và đánh dấu row cũ là "đã chết" (dead tuple).
- Transaction chỉ nhìn thấy rows có `xmin` ≤ transaction ID của mình và `xmax` > transaction ID (hoặc chưa set).
- Lợi ích: **Read KHÔNG BAO GIỜ block Write. Write KHÔNG block Read.** (Chỉ Write block Write cùng row).
- Nhược điểm: Dead tuples tích tụ → cần VACUUM để dọn rác (PostgreSQL auto-vacuum mặc định).

---

## IV. Locking Mechanisms (Cơ chế Khóa)

### 4.1 Tại sao cần Locking?
Khi nhiều transaction đồng thời cập nhật cùng 1 dữ liệu, nếu không có cơ chế kiểm soát sẽ xảy ra **Race Condition** — data bị sai.

```
Ví dụ Race Condition (không có lock):
Số dư ví: 1,000,000đ
Request A: Rút 700,000đ            Request B: Rút 500,000đ
──────────────────────              ──────────────────────
Đọc balance = 1,000,000            Đọc balance = 1,000,000
Tính: 1,000,000 - 700,000          Tính: 1,000,000 - 500,000
Ghi balance = 300,000              Ghi balance = 500,000

→ Kết quả cuối: balance = 500,000 (hoặc 300,000 tùy ai ghi sau)
→ Thực tế đã rút 1,200,000đ từ ví chỉ có 1,000,000đ! → THẤT THOÁT!
```

### 4.2 Pessimistic Locking (Khóa Bi Quan)

Quan điểm: **"Luôn giả định sẽ có xung đột → Khóa trước, hỏi sau"**

Khi đọc data, lập tức khóa cứng row đó lại. Mọi transaction khác muốn đọc/ghi cùng row phải ĐỢI cho đến khi transaction hiện tại COMMIT hoặc ROLLBACK.

```sql
-- ─── SELECT ... FOR UPDATE ───
-- Khóa hoàn toàn row, cả đọc và ghi đều bị chặn

BEGIN;
  -- Đọc VÀ KHÓA row ví user 1
  SELECT balance FROM wallets WHERE user_id = 1 FOR UPDATE;
  -- → Row user_id=1 bị LOCKED

  -- Transaction khác cố SELECT FOR UPDATE cùng row → BỊ TREO CHỜ

  -- Kiểm tra đủ tiền
  -- Trừ tiền
  UPDATE wallets SET balance = balance - 700000 WHERE user_id = 1;
COMMIT; -- Mở khóa → Transaction đang chờ được chạy tiếp

-- ─── SELECT ... FOR SHARE ───
-- Cho phép đọc đồng thời nhưng không cho UPDATE
-- Nhiều transaction có thể giữ shared lock cùng lúc
-- Nhưng nếu ai muốn UPDATE → phải đợi tất cả shared lock release
SELECT * FROM products WHERE id = 1 FOR SHARE;

-- ─── NOWAIT và SKIP LOCKED ───
-- NOWAIT: Nếu row bị locked → báo lỗi NGAY thay vì chờ
SELECT * FROM wallets WHERE user_id = 1 FOR UPDATE NOWAIT;
-- → ERROR: could not obtain lock on row

-- SKIP LOCKED: Bỏ qua rows đang bị locked, chỉ lấy rows chưa bị khóa
-- Use case: Job queue — nhiều worker cùng lấy task từ bảng tasks
SELECT * FROM tasks WHERE status = 'pending'
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
-- Worker A lấy task 1 (lock), Worker B bỏ qua task 1, lấy task 2
```

**Ưu và nhược điểm Pessimistic Lock:**
- ✅ Đảm bảo tuyệt đối không xung đột dữ liệu.
- ✅ Phù hợp hệ thống tài chính, thanh toán, quản lý ví tiền.
- ❌ Giảm hiệu năng — buộc xử lý tuần tự.
- ❌ Nguy cơ Deadlock nếu khóa không đúng thứ tự.
- ❌ Timeout nếu transaction giữ lock quá lâu.

### 4.3 Optimistic Locking (Khóa Lạc Quan)

Quan điểm: **"Giả định ít khi xung đột → Cứ chạy thoải mái, kiểm tra lúc ghi"**

Không khóa DB. Thêm cột `version` (hoặc `updated_at`) vào bảng. Khi UPDATE, kiểm tra version có đúng version lúc đọc không.

```sql
-- Bảng wallets có cột version
-- | user_id | balance   | version |
-- | 1       | 1,000,000 | 5       |

-- Request A đọc: balance=1,000,000, version=5
-- Request B đọc: balance=1,000,000, version=5 (cùng lúc)

-- Request A update:
UPDATE wallets 
SET balance = balance - 700000, version = version + 1  
WHERE user_id = 1 AND version = 5;
-- → affected rows = 1 (SUCCESS!) → version thành 6

-- Request B update:
UPDATE wallets 
SET balance = balance - 500000, version = version + 1  
WHERE user_id = 1 AND version = 5;
-- → affected rows = 0 (FAIL!) → version đã là 6, không phải 5
-- → Backend detect fail → throw ConflictException hoặc retry
```

**Implement trong NestJS/TypeORM:**
```typescript
// Entity
@Entity()
export class Wallet {
  @PrimaryColumn()
  userId: number;

  @Column('decimal')
  balance: number;

  @VersionColumn() // TypeORM tự quản lý version!
  version: number;
}

// Service
async withdraw(userId: number, amount: number) {
  const wallet = await this.walletRepo.findOneBy({ userId });
  
  if (wallet.balance < amount) {
    throw new BadRequestException('Số dư không đủ');
  }

  wallet.balance -= amount;

  try {
    await this.walletRepo.save(wallet);
    // TypeORM tự thêm WHERE version = X và tăng version
  } catch (error) {
    if (error instanceof OptimisticLockVersionMismatchError) {
      throw new ConflictException('Dữ liệu đã thay đổi, vui lòng thử lại');
      // Hoặc implement retry logic
    }
    throw error;
  }
}
```

**Ưu và nhược điểm Optimistic Lock:**
- ✅ Hiệu năng cao — không block database.
- ✅ Phù hợp hệ thống ít xung đột ghi (VD: cập nhật profile user, sửa bài viết).
- ❌ Không phù hợp nếu xung đột thường xuyên (phải retry liên tục).
- ❌ Cần implement retry logic ở application layer.

### 4.4 Deadlock (Bế tắc)

```
Transaction A                    Transaction B
─────────────                    ─────────────
BEGIN;                           BEGIN;
LOCK row 1 (FOR UPDATE)          LOCK row 2 (FOR UPDATE)
...                              ...
Muốn LOCK row 2 → ĐỢI B        Muốn LOCK row 1 → ĐỢI A
    ↓                                ↓
    ├────── CHỜ NHAU VÔ HẠN ──────┤
    └──────── DEADLOCK! ───────────┘
```

**PostgreSQL xử lý Deadlock:**
- PostgreSQL có deadlock detector chạy mỗi giây (configurable: `deadlock_timeout`, mặc định 1s).
- Khi phát hiện deadlock → tự động ABORT 1 transaction (victim) và trả lỗi.
- Transaction còn lại được tiếp tục.

**Cách phòng tránh Deadlock:**
1. **Luôn lock theo thứ tự cố định:** Nếu cần lock row A và row B, luôn lock theo thứ tự ID tăng dần.
2. **Giữ transaction ngắn nhất có thể:** Đừng đặt logic nặng hoặc chờ user input bên trong transaction.
3. **Dùng NOWAIT hoặc timeout:** Thay vì chờ vô hạn, fail nhanh và retry.

```sql
-- Phòng tránh: Lock theo thứ tự ID tăng dần
BEGIN;
  SELECT * FROM accounts WHERE id IN (1, 5) ORDER BY id FOR UPDATE;
  -- Luôn lock id=1 trước, id=5 sau → mọi transaction đều cùng thứ tự
COMMIT;
```

---

## V. Query Optimization (Tối ưu truy vấn)

### 5.1 EXPLAIN ANALYZE

```sql
-- EXPLAIN: Xem query plan (kế hoạch thực thi) mà PostgreSQL dự định dùng
-- EXPLAIN ANALYZE: Chạy query THẬT và đo thời gian thực tế

EXPLAIN ANALYZE
SELECT * FROM orders 
WHERE user_id = 1 AND status = 'paid' 
ORDER BY created_at DESC;

-- Kết quả ví dụ:
-- Sort (cost=100.25..100.26 rows=5 width=48) (actual time=0.025..0.026 rows=5 loops=1)
--   Sort Key: created_at DESC
--   →  Index Scan using idx_orders_user_status on orders
--        Index Cond: (user_id = 1 AND status = 'paid')
--        (actual time=0.015..0.018 rows=5 loops=1)
-- Planning Time: 0.150 ms
-- Execution Time: 0.045 ms

-- Các từ khóa cần chú ý:
-- "Index Scan" → TỐT! Đang dùng index
-- "Seq Scan" → XẤU! Full table scan → cần thêm index
-- "Bitmap Index Scan" → OK, dùng index nhưng quét nhiều rows
-- "actual time" → Thời gian thực tế (mili-giây)
-- "rows" → Số rows thực tế trả về
```

### 5.2 N+1 Query Problem (Vấn đề kinh điển)

```
Giả sử bạn muốn lấy 10 users kèm orders của từng user:

❌ N+1 Problem:
Query 1: SELECT * FROM users LIMIT 10;                    → 1 query
Query 2: SELECT * FROM orders WHERE user_id = 1;          → +1
Query 3: SELECT * FROM orders WHERE user_id = 2;          → +1
...
Query 11: SELECT * FROM orders WHERE user_id = 10;         → +1
→ Tổng: 11 queries! Nếu 1000 users → 1001 queries → CỰC CHẬM

✅ Fix 1: Eager Loading (JOIN)
SELECT u.*, o.* FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LIMIT 10;
→ 1 query duy nhất!

✅ Fix 2: Batch Loading (IN clause)
SELECT * FROM users LIMIT 10;
SELECT * FROM orders WHERE user_id IN (1,2,3,4,5,6,7,8,9,10);
→ 2 queries!

✅ Fix 3: DataLoader (GraphQL/NestJS)
// DataLoader tự động batch và cache
const userLoader = new DataLoader(async (userIds) => {
  const orders = await ordersRepo.find({ where: { userId: In(userIds) } });
  // Group orders by userId và trả về đúng thứ tự
});
```

### 5.3 Stored Procedures, Functions, Triggers

```sql
-- ─── Function ───
-- Trả về giá trị, có thể dùng trong SELECT
CREATE FUNCTION get_user_total_spent(p_user_id INTEGER)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = p_user_id;
$$ LANGUAGE SQL;

SELECT name, get_user_total_spent(id) AS total_spent FROM users;

-- ─── Stored Procedure ───
-- Thực hiện tác vụ phức tạp, có thể chứa transaction
CREATE PROCEDURE transfer_money(
  sender_id INTEGER,
  receiver_id INTEGER,
  amount DECIMAL
)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE accounts SET balance = balance - amount WHERE user_id = sender_id;
  UPDATE accounts SET balance = balance + amount WHERE user_id = receiver_id;
  
  INSERT INTO transactions (from_id, to_id, amount) VALUES (sender_id, receiver_id, amount);
END;
$$;

CALL transfer_money(1, 2, 500000);

-- ─── Trigger ───
-- Tự động thực thi khi có INSERT/UPDATE/DELETE
-- Use case: Auto-update updated_at, audit log, sync data

CREATE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();
-- Mỗi lần UPDATE users → updated_at tự động set = NOW()
```

**Khi nào dùng logic ở DB layer?**
- ✅ Dùng khi: Logic đơn giản, cần đảm bảo data integrity bất kể app nào truy cập (triggers cho `updated_at`, constraints, audit log).
- ❌ Không dùng khi: Business logic phức tạp, cần debug/test dễ dàng, cần scale (stored procedures khó di chuyển giữa các DB).
- Nguyên tắc: **Giữ DB "ngu" nhất có thể, để business logic ở application layer (NestJS Service).**

---

# PHẦN B — CÂU HỎI PHỎNG VẤN & TRẢ LỜI

---

## Q1: Phân biệt B-Tree Index và Hash Index. Khi nào Index KHÔNG có tác dụng?
**Trả lời:**
- **B-Tree:** Mặc định trong PostgreSQL. Lưu dạng cây cân bằng, tìm kiếm O(log n). Hỗ trợ cả `=`, `<`, `>`, `BETWEEN`, `ORDER BY`, `LIKE 'abc%'`.
- **Hash:** Chỉ hỗ trợ phép `=`. Nhanh hơn B-Tree chút ít cho equality nhưng không linh hoạt.
- **Index vô tác dụng khi:** (1) Dùng hàm trên cột index (`WHERE UPPER(name) = ...`), (2) LIKE wildcard đầu (`'%abc'`), (3) Cột low cardinality (gender chỉ có 2 giá trị), (4) Type mismatch (so sánh int với string).
- **Write Penalty:** Mỗi INSERT/UPDATE/DELETE phải cập nhật tất cả index liên quan → càng nhiều index càng chậm ghi.

## Q2: Giải thích nguyên tắc ACID. Tại sao quan trọng?
**Trả lời:**
- **Atomicity:** Tất cả hoặc không gì. Chuyển tiền mà trừ xong rồi cộng bị lỗi → tự rollback, tiền không mất.
- **Consistency:** Data luôn hợp lệ theo rules/constraints trước và sau transaction.
- **Isolation:** Các transaction song song không ảnh hưởng lẫn nhau. Mức độ: Read Committed (default PG), Repeatable Read, Serializable.
- **Durability:** Đã COMMIT = vĩnh viễn. Server crash → data vẫn còn nhờ WAL (Write-Ahead Log).
- Quan trọng vì nếu thiếu ACID, hệ thống tài chính có thể mất tiền, e-commerce oversell sản phẩm, data bất nhất quán.

## Q3: Phân biệt Optimistic Lock và Pessimistic Lock. Khi nào dùng cái nào?
**Trả lời:**
- **Pessimistic Lock:** Khóa row trước rồi mới xử lý (`SELECT ... FOR UPDATE`). Đảm bảo tuyệt đối nhưng chậm, có nguy cơ deadlock. Dùng cho: thanh toán, chuyển tiền, quản lý ví — nơi sai 1 đồng cũng không chấp nhận được.
- **Optimistic Lock:** Không khóa DB, thêm cột `version`. Update kèm `WHERE version = X`. Nếu version đã đổi → fail → retry. Hiệu năng cao nhưng phải xử lý conflict. Dùng cho: cập nhật profile, sửa bài viết, CRUD ít xung đột.
- **Quy tắc chọn:** Conflict thường xuyên → Pessimistic. Conflict hiếm → Optimistic.

## Q4: N+1 Query Problem là gì? Cách fix?
**Trả lời:**
Khi lấy N entities kèm relationship, ORM phát sinh 1 query chính + N query phụ. VD: 100 users → 101 queries.
- **Fix 1:** Eager Loading — JOIN trong 1 query.
- **Fix 2:** Batch Loading — gom userIds vào IN clause (2 queries).
- **Fix 3:** DataLoader — batch + cache tự động (cho GraphQL).
- Luôn dùng EXPLAIN ANALYZE để kiểm tra query plan.

## Q5: Deadlock là gì? Cách phòng tránh?
**Trả lời:**
Deadlock xảy ra khi 2 transaction chờ nhau giải phóng lock → bế tắc vĩnh viễn. PostgreSQL tự detect (mỗi 1s) và abort 1 transaction victim.
- **Phòng tránh:** (1) Lock theo thứ tự ID cố định, (2) Giữ transaction ngắn nhất, (3) Dùng NOWAIT fail nhanh thay vì chờ, (4) Giảm isolation level nếu có thể.

## Q6: Khi nào dùng Denormalization? Trade-off là gì?
**Trả lời:**
Dùng khi hệ thống đọc >> ghi (báo cáo, dashboard, analytics). Lưu dư data để tránh JOIN nặng. VD: Lưu `total_items` trong orders thay vì COUNT từ order_items.
- Trade-off: Đọc nhanh hơn ↔ Ghi phức tạp hơn (phải sync nhiều nơi), nguy cơ data không đồng bộ.
- Luôn bắt đầu với Normalized design (3NF), chỉ Denormalize khi chứng minh được bottleneck bằng EXPLAIN ANALYZE.
