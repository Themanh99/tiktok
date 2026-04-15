# Frontend (React, Vue, TailwindCSS) — Kiến Thức Chuyên Sâu (Mid/Senior)

> Tài liệu này bao gồm kiến thức nền tảng cần học trước, sau đó là các câu hỏi phỏng vấn kèm câu trả lời chi tiết.

---

# PHẦN A — KIẾN THỨC NỀN TẢNG CẦN HỌC

---

## I. HTML & CSS Nâng Cao

### 1.1 Semantic HTML (HTML ngữ nghĩa)
Semantic HTML sử dụng các thẻ có ý nghĩa mô tả nội dung thay vì `<div>` vô nghĩa. Quan trọng cho SEO (Google hiểu cấu trúc trang) và Accessibility (trình đọc màn hình cho người khiếm thị).

```html
<!-- ❌ Không Semantic -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Trang chủ</div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="title">Tiêu đề bài viết</div>
  </div>
  <div class="sidebar">...</div>
</div>
<div class="footer">...</div>

<!-- ✅ Semantic -->
<header>
  <nav>
    <a href="/">Trang chủ</a>
  </nav>
</header>
<main>
  <article>
    <h1>Tiêu đề bài viết</h1>  <!-- Chỉ 1 h1 duy nhất mỗi trang -->
    <section>
      <h2>Mục con</h2>
      <p>Nội dung...</p>
    </section>
  </article>
  <aside>Sidebar</aside>       <!-- Nội dung phụ, liên quan -->
</main>
<footer>
  <p>&copy; 2024</p>
</footer>
```

### 1.2 Flexbox vs Grid — Khi nào dùng cái nào?

**Flexbox — Layout 1 chiều (hàng HOẶC cột):**
```css
/* Flexbox: căn chỉnh items theo 1 trục (main axis) */
.flex-container {
  display: flex;
  flex-direction: row;           /* row | column */
  justify-content: space-between; /* căn theo trục chính */
  align-items: center;            /* căn theo trục phụ */
  gap: 16px;                      /* khoảng cách giữa items */
  flex-wrap: wrap;                /* xuống hàng nếu tràn */
}

.flex-item {
  flex: 1;            /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  /* flex: 0 0 200px; → không giãn, không co, chiều rộng cố định 200px */
}

/* Use case: Navbar, toolbar, card row, align items vertically/horizontally */
```

**Grid — Layout 2 chiều (hàng VÀ cột cùng lúc):**
```css
/* Grid: chia layout thành lưới 2D */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 cột bằng nhau */
  grid-template-rows: auto 1fr auto;       /* header, content, footer */
  gap: 20px;
  min-height: 100vh;
}

/* Layout phức tạp với grid-template-areas */
.page-layout {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar content content"
    "footer  footer  footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr 40px;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }

/* Responsive Grid — tự co giãn số cột */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  /* Tự động tạo bao nhiêu cột vừa được, mỗi cột tối thiểu 280px */
  gap: 16px;
}

/* Use case: Page layout, dashboard, product grid, gallery */
```

**Quy tắc chọn:**
- **Flexbox:** Khi layout chỉ cần 1 chiều (hàng items, thanh navigation, align center).
- **Grid:** Khi layout cần 2 chiều (page layout, dashboard grid, gallery ảnh).
- **Kết hợp:** Grid cho layout tổng thể, Flexbox cho từng component bên trong.

### 1.3 CSS Repaint và Reflow
Khi browser render trang web, nó trải qua pipeline:
```
Parse HTML → DOM tree
                        → Render Tree → Layout (Reflow) → Paint → Composite
Parse CSS  → CSSOM tree
```

**Reflow (Layout):** Tính lại vị trí và kích thước của elements. TỐN HIỆU NĂNG NHẤT vì ảnh hưởng hàng cây DOM.
- Trigger bởi: thay đổi `width`, `height`, `margin`, `padding`, `top`, `left`, `font-size`, thêm/xóa DOM element, resize window.

**Repaint:** Vẽ lại pixels nhưng KHÔNG thay đổi layout.
- Trigger bởi: thay đổi `color`, `background-color`, `visibility`, `box-shadow`.

**Composite:** GPU render riêng từng layer, sau đó ghép lại.
- Trigger bởi: `transform`, `opacity` → NHẸ NHẤT! GPU xử lý.

```css
/* ❌ Animation gây Reflow liên tục → giật lag */
@keyframes move-bad {
  from { left: 0; top: 0; }
  to   { left: 300px; top: 200px; }
}

/* ✅ Animation dùng transform → Composite only → mượt 60fps */
@keyframes move-good {
  from { transform: translate(0, 0); }
  to   { transform: translate(300px, 200px); }
}

/* Mẹo tối ưu: */
.animated-element {
  /* Báo cho browser biết element này sẽ thay đổi → tạo layer riêng */
  will-change: transform;
  /* Hoặc trick cũ: */
  transform: translateZ(0); /* Force GPU layer */
}
```

### 1.4 Responsive Design

```css
/* Mobile First: Style cho mobile trước, media query cho màn lớn */
.container {
  padding: 16px;
  font-size: 14px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* CSS Units quan trọng: */
/* px    — tuyệt đối, không scale theo user settings */
/* rem   — relative to root font-size (16px default). Dùng cho spacing, font-size */
/* em    — relative to parent font-size. Dùng trong component cần scale theo context */
/* vh/vw — viewport height/width. 100vh = full height màn hình */
/* %     — relative to parent element */

/* Thực tế: font-size dùng rem, spacing dùng rem/px, width dùng % hoặc fr */
```

---

## II. TailwindCSS

### 2.1 Utility-First CSS là gì?
Thay vì viết CSS classes mô tả component (`.btn-primary`, `.card-header`), Tailwind cung cấp hàng nghìn utility classes nhỏ mô tả style (`flex`, `text-lg`, `bg-blue-500`, `p-4`).

```html
<!-- CSS truyền thống -->
<style>
.card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}
</style>
<div class="card">
  <h3 class="card-title">Sản phẩm</h3>
</div>

<!-- TailwindCSS — không cần viết CSS riêng -->
<div class="flex flex-col p-6 rounded-xl bg-white shadow-md 
            hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
  <h3 class="text-xl font-bold text-gray-900 mb-2">Sản phẩm</h3>
</div>
```

### 2.2 Ưu nhược điểm TailwindCSS

**Ưu điểm:**
1. **File CSS nhỏ:** Tailwind chỉ compile những class bạn dùng (PurgeCSS/JIT). File CSS production thường chỉ 10-30KB gzipped.
2. **Không Dead CSS:** Xóa component HTML = xóa luôn style. Không bao giờ có CSS thừa.
3. **Không naming fatigue:** Không phải nghĩ tên class (`.container-wrapper-inner-box-v2`).
4. **Consistency:** Design token sẵn (`text-sm/base/lg/xl`, `p-1/2/3/4`, `text-gray-50/100/.../900`) đảm bảo spacing và màu sắc đồng nhất.
5. **Không CSS conflict:** Utility classes có scope cục bộ, không bao giờ đè nhau.
6. **Responsive tích hợp:** `md:flex` = chỉ áp dụng flex từ breakpoint medium trở lên.
7. **Dark mode tích hợp:** `dark:bg-gray-800` = background gray khi dark mode.

**Nhược điểm:**
1. **HTML dài:** Template class dài dòng, khó đọc lần đầu.
2. **Đường cong học tập:** Phải nhớ nhiều class names.
3. **Khó tạo style phức tạp:** Animation phức tạp, pseudo-elements nâng cao cần viết CSS riêng.

**Giải pháp cho HTML dài:**
```typescript
// Trong React: Dùng @apply hoặc tách component
// Hoặc dùng thư viện cn() (clsx + tailwind-merge)
import { cn } from '@/lib/utils';

function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        className  // Cho phép override từ parent
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 2.3 Responsive & Dark Mode trong Tailwind

```html
<!-- Responsive: breakpoints áp dụng từ kích cỡ đó TRỞ LÊN (mobile first) -->
<div class="
  grid grid-cols-1          /* Mobile: 1 cột */
  sm:grid-cols-2            /* ≥640px: 2 cột */
  md:grid-cols-3            /* ≥768px: 3 cột */
  lg:grid-cols-4            /* ≥1024px: 4 cột */
  gap-4
">
  <div class="p-4 bg-white rounded-lg">Card 1</div>
  <div class="p-4 bg-white rounded-lg">Card 2</div>
  <!-- ... -->
</div>

<!-- Dark Mode -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
    Tiêu đề
  </h1>
  <p class="text-gray-600 dark:text-gray-400">
    Nội dung mô tả
  </p>
</div>

<!-- Hover, Focus, Active states -->
<button class="
  bg-blue-500
  hover:bg-blue-600
  active:bg-blue-700
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
">
  Click me
</button>

<!-- Group hover — hover parent ảnh hưởng child -->
<div class="group p-4 hover:bg-blue-50 rounded-lg cursor-pointer">
  <h3 class="text-gray-900 group-hover:text-blue-600">Tiêu đề</h3>
  <p class="text-gray-500 group-hover:text-gray-700">Mô tả</p>
  <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
</div>
```

---

## III. ReactJS Chuyên Sâu

### 3.1 Cơ chế Rendering & Virtual DOM
React sử dụng Virtual DOM — một bản sao nhẹ của DOM thật nằm trong bộ nhớ JavaScript.

```
Luồng render React:
                                          ┌──────────┐
State thay đổi (setState) ──→ Tạo Virtual │  VDOM    │ mới
                                          └────┬─────┘
                                               │
                                          So sánh (Diffing algorithm)
                                               │
                                    ┌──────────┴─────────────┐
                                    │ Virtual DOM cũ vs mới   │
                                    └──────────┬─────────────┘
                                               │
                                    Tìm ra sự khác biệt tối thiểu
                                               │
                                    ┌──────────┴─────────────┐
                                    │ Cập nhật CHỈ phần thay │
                                    │ đổi trên DOM thật      │
                                    └────────────────────────┘
```

**Tại sao không sửa DOM trực tiếp?**
- Mỗi lần thay đổi DOM thật → browser phải Reflow + Repaint → rất tốn hiệu năng.
- React batch nhiều thay đổi lại, tính toán sự khác biệt tối thiểu trên VDOM (nhanh vì chỉ là object JS), rồi áp dụng 1 lần lên DOM thật.

### 3.2 Khi nào React Re-render?
Một component React re-render khi:
1. **State thay đổi:** `setState()` hoặc setter function từ `useState`.
2. **Props thay đổi:** Parent truyền props mới.
3. **Parent re-render:** Mặc định, khi parent re-render thì TẤT CẢ children cũng re-render (kể cả props không đổi).
4. **Context thay đổi:** Component subscribe Context có value mới.

```typescript
// Automatic Batching (React 18+)
function handleClick() {
  setCount(c => c + 1);    // Không render
  setName('Alice');         // Không render  
  setAge(25);               // Không render
  // → React gom lại, CHỈ RE-RENDER 1 LẦN với cả 3 state mới
}

// Trước React 18, chỉ batch trong event handlers
// React 18: batch MỌI NƠI (setTimeout, Promise, async/await)
setTimeout(() => {
  setCount(c => c + 1);
  setName('Bob');
  // React 18: 1 re-render
  // React 17: 2 re-renders
}, 1000);
```

### 3.3 Tối ưu Re-render: \`React.memo\`, \`useMemo\`, \`useCallback\`

```typescript
// ═══════════════ React.memo ═══════════════
// Bọc component con → chỉ re-render khi PROPS thay đổi (shallow comparison)

const ExpensiveList = React.memo(function ExpensiveList({ items, onItemClick }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

// ═══════════════ useMemo ═══════════════
// Cache KẾT QUẢ tính toán nặng → chỉ tính lại khi dependencies thay đổi

function Dashboard({ transactions }) {
  // ❌ Mỗi lần component re-render → tính lại từ đầu dù transactions không đổi
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // ✅ Chỉ tính lại khi transactions thay đổi
  const totalRevenue = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // ❌ ĐỪNG useMemo cho tính toán đơn giản
  const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
  // Chi phí useMemo (so sánh deps, cache) > chi phí nối string
  // ✅ Chỉ cần:
  const fullName = `${firstName} ${lastName}`;
}

// ═══════════════ useCallback ═══════════════
// Cache ĐỊA CHỈ THAM CHIẾU (reference) của function
// Chỉ có ý nghĩa khi kết hợp với React.memo hoặc truyền vào dependency

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ❌ Mỗi lần Parent re-render → tạo function MỚI → reference khác
  // → React.memo trên Child vô tác dụng vì "props.onDelete" luôn khác
  const handleDelete = (id) => {
    deleteItem(id);
  };

  // ✅ useCallback giữ nguyên reference giữa các lần render
  const handleDelete = useCallback((id) => {
    deleteItem(id);
  }, []); // dependencies rỗng → function không bao giờ thay đổi

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      {/* Khi gõ input → Parent re-render → nhưng Child KHÔNG re-render 
          vì props (items + handleDelete) không thay đổi */}
      <ExpensiveList items={items} onItemClick={handleDelete} />
    </>
  );
}
```

**Quy tắc vàng — Khi nào KHÔNG dùng memo:**
1. Tính toán đơn giản (nối string, phép cộng) → đừng `useMemo`.
2. Function không truyền xuống con hoặc con không memo → đừng `useCallback`.
3. Component re-render ít hoặc render nhanh → đừng `React.memo`.
4. **Đo trước, tối ưu sau.** React DevTools Profiler cho biết component nào chậm.

### 3.4 State Management: Context vs Redux vs Zustand

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHỌN STATE MANAGEMENT                            │
├─────────────────┬──────────────────┬────────────────────────────────┤
│ React Context   │ Redux Toolkit    │ Zustand                        │
├─────────────────┼──────────────────┼────────────────────────────────┤
│ Built-in React  │ Thư viện lớn     │ Thư viện nhẹ (~1KB)           │
│ Đơn giản        │ Boilerplate nhiều│ API đơn giản nhất             │
│ Không cache     │ Redux DevTools   │ Không provider/wrapper        │
│ Re-render toàn  │ Selector tối ưu  │ Selector tối ưu               │
│ bộ consumers    │ Middleware       │ Middleware                     │
├─────────────────┼──────────────────┼────────────────────────────────┤
│ Dùng cho:       │ Dùng cho:        │ Dùng cho:                     │
│ Theme, locale,  │ App lớn,         │ Hầu hết mọi app              │
│ auth state đơn  │ state phức tạp,  │ (thay thế Context & Redux)   │
│ giản            │ cần time-travel  │                                │
│                 │ debugging        │                                │
└─────────────────┴──────────────────┴────────────────────────────────┘
```

**Vấn đề của Context API:**
```typescript
// ❌ VẤN ĐỀ: Khi bất kỳ value nào trong context thay đổi,
// TẤT CẢ components subscribe context đều re-render
// Dù component đó chỉ dùng 1 field nhỏ

const AppContext = createContext({
  user: null,
  theme: 'light',
  notifications: [],       // Mảng thay đổi liên tục
  setUser: () => {},
  setTheme: () => {},
});

// Component chỉ dùng theme. Nhưng khi notifications thay đổi → cũng re-render!
function ThemeToggle() {
  const { theme, setTheme } = useContext(AppContext);
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle</button>;
}

// ✅ GIẢI PHÁP 1: Tách nhiều Context nhỏ
// ThemeContext, UserContext, NotificationContext
// → Component chỉ subscribe đúng context cần

// ✅ GIẢI PHÁP 2: Dùng Zustand
import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  notifications: [],
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  addNotification: (n) => set((state) => ({ 
    notifications: [...state.notifications, n] 
  })),
}));

// Zustand selector: Chỉ re-render khi theme thay đổi
function ThemeToggle() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  // notifications thay đổi? KHÔNG re-render! Vì selector chỉ lấy theme
}
```

### 3.5 Custom Hooks (Tách Logic Tái Sử Dụng)

```typescript
// Hook tái sử dụng logic gọi API
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController(); // Để cancel request nếu component unmount

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort(); // Cleanup: cancel khi unmount hoặc url đổi
  }, [url]);

  return { data, loading, error };
}

// Sử dụng:
function UserProfile({ userId }) {
  const { data: user, loading, error } = useApi<User>(`/api/users/${userId}`);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{user.name}</div>;
}

// Hook quản lý form đơn giản
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error khi user sửa
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, setErrors, handleChange, reset };
}
```

### 3.6 useEffect — Cleanup và Race Condition

```typescript
// ❌ Race Condition: User click nhanh giữa profile 1 → profile 2
// Request profile 1 chậm, profile 2 nhanh
// Profile 2 hiện trước, profile 1 đến sau → GHI ĐÈ profile 2 → sai data!

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false; // Biến cờ

    async function loadUser() {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      
      if (!cancelled) { // Chỉ set state nếu chưa bị cancel
        setUser(data);
      }
    }

    loadUser();

    return () => {
      cancelled = true; // Cleanup: đánh dấu cancel khi userId đổi
    };
  }, [userId]);
}

// ✅ Cách tốt hơn: dùng AbortController
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    });

  return () => controller.abort(); // Cancel HTTP request thật sự!
}, [userId]);
```

### 3.7 React Server Components vs Client Components (React 18+/Next.js)

```
┌────────────────────────────────────────────────────────────┐
│              SERVER COMPONENTS    │    CLIENT COMPONENTS    │
├──────────────────────────────────┼─────────────────────────┤
│ Mặc định trong Next.js App Router│ Đánh dấu 'use client'  │
│ Render trên SERVER               │ Render trên BROWSER     │
│ Không gửi JS xuống client       │ JS bundle gửi xuống     │
│ Truy cập DB, file system trực tiếp│ Dùng useState, useEffect│
│ Không dùng được hooks            │ Dùng được tất cả hooks  │
│ Không event handlers (onClick)  │ Có event handlers       │
│ SEO tốt (HTML sẵn)              │ SEO cần SSR             │
├──────────────────────────────────┼─────────────────────────┤
│ Dùng cho:                        │ Dùng cho:               │
│ - Fetch data                     │ - Form, input           │
│ - Layout tĩnh                   │ - Interactive UI        │
│ - Hiển thị nội dung             │ - Real-time updates     │
│ - Truy cập backend              │ - Browser APIs          │
└──────────────────────────────────┴─────────────────────────┘
```

---

## IV. Vue 3 Chuyên Sâu

### 4.1 Vue 3 Composition API vs Options API

```javascript
// ═══════════════ Options API (Vue 2 style) ═══════════════
export default {
  data() {
    return {
      count: 0,
      name: 'Alice',
    };
  },
  computed: {
    doubleCount() { return this.count * 2; },
  },
  methods: {
    increment() { this.count++; },
  },
  watch: {
    count(newVal, oldVal) {
      console.log(`Count changed: ${oldVal} → ${newVal}`);
    },
  },
  mounted() {
    console.log('Component mounted');
  },
};
// Nhược điểm: Logic của 1 feature bị PHÂN TÁN qua data, methods, computed, watch
// Component lớn → rất khó đọc, logic feature A xen lẫn feature B

// ═══════════════ Composition API (Vue 3) ═══════════════
import { ref, computed, watch, onMounted } from 'vue';

export default {
  setup() {
    // Feature: Counter — gom tất cả logic lại 1 chỗ
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    const increment = () => { count.value++; };
    
    watch(count, (newVal, oldVal) => {
      console.log(`Count changed: ${oldVal} → ${newVal}`);
    });

    // Feature: User info — gom riêng, dễ tách thành composable
    const name = ref('Alice');

    onMounted(() => {
      console.log('Component mounted');
    });

    return { count, doubleCount, increment, name };
  },
};

// ═══════════════ Script Setup (Cú pháp gọn nhất) ═══════════════
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => { count.value++; };

watch(count, (newVal, oldVal) => {
  console.log(`Count changed: ${oldVal} → ${newVal}`);
});

onMounted(() => console.log('Mounted'));
</script>
```

### 4.2 Vue Reactivity System — Proxy-based

```javascript
// Vue 3 dùng JavaScript Proxy để theo dõi thay đổi
// Khi bạn đọc/ghi thuộc tính object, Proxy tự động bắt sự kiện

// Cách Vue hoạt động bên dưới (đơn giản hóa):
const raw = { count: 0 };
const reactiveObj = new Proxy(raw, {
  get(target, key) {
    track(target, key); // Theo dõi: "component X đang đọc key này"
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key); // Kích hoạt: "key này thay đổi, update component X"
    return true;
  },
});

// Thực tế sử dụng:
import { ref, reactive } from 'vue';

// ref: Bọc giá trị đơn (primitive) — truy cập qua .value
const count = ref(0);
count.value++;           // .value trong JS
// Trong template: {{ count }}  — tự unwrap, không cần .value

// reactive: Bọc object/array — truy cập trực tiếp
const state = reactive({
  user: { name: 'Alice', age: 25 },
  items: ['a', 'b', 'c'],
});
state.user.name = 'Bob';         // ✅ Vue detect được
state.items.push('d');           // ✅ Vue detect được (khác React!)
// React: phải setState([...items, 'd']) vì React yêu cầu immutable
// Vue: mutate trực tiếp được vì Proxy bắt mọi thay đổi
```

### 4.3 So sánh Reactivity: Vue vs React

| Tiêu chí | React | Vue 3 |
|---|---|---|
| **Cơ chế** | Immutable state + Virtual DOM diffing | Proxy-based tracking |
| **Cập nhật state** | `setState(new value)` — phải tạo object mới | `state.key = value` — mutate trực tiếp |
| **Detect thay đổi** | So sánh toàn bộ VDOM subtree (top-down) | Theo dõi chính xác từng property đang dùng |
| **Re-render scope** | Toàn bộ component + children (trừ khi memo) | Chỉ phần template dùng property thay đổi |
| **Tối ưu thủ công** | `useMemo`, `useCallback`, `React.memo` | Hiếm khi cần (Vue tối ưu sẵn) |
| **Array update** | `setItems([...items, newItem])` | `items.push(newItem)` |

### 4.4 Vue Lifecycle Hooks

```
beforeCreate  ──→  setup() (Composition API thay thế)
created       ──→  setup()
beforeMount   ──→  onBeforeMount()
mounted       ──→  onMounted()          ← DOM đã sẵn sàng, gọi API ở đây
beforeUpdate  ──→  onBeforeUpdate()
updated       ──→  onUpdated()
beforeUnmount ──→  onBeforeUnmount()    ← Cleanup (clear interval, event listener)
unmounted     ──→  onUnmounted()
```

```javascript
// watch vs watchEffect
import { ref, watch, watchEffect } from 'vue';

const userId = ref(1);
const userData = ref(null);

// watch: Theo dõi source CỤ THỂ, có oldValue
watch(userId, async (newId, oldId) => {
  console.log(`User changed: ${oldId} → ${newId}`);
  userData.value = await fetchUser(newId);
}, { immediate: true }); // immediate: chạy ngay lần đầu

// watchEffect: Tự detect dependencies, chạy ngay lần đầu
watchEffect(async () => {
  // Vue tự biết effect này phụ thuộc vào userId.value
  userData.value = await fetchUser(userId.value);
});
// Khi userId thay đổi → effect tự chạy lại
```

### 4.5 Vuex vs Pinia

```javascript
// ═══════════════ Vuex (Vue 2/3 — cũ) ═══════════════
const store = new Vuex.Store({
  state: {
    count: 0,
    user: null,
  },
  // Mutations: CÁI DUY NHẤT được phép sửa state (đồng bộ)
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    SET_USER(state, user) {
      state.user = user;
    },
  },
  // Actions: Gọi API async, rồi commit mutation
  actions: {
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId);
      commit('SET_USER', user);   // Không được sửa state trực tiếp!
    },
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
});

// component gọi:
this.$store.dispatch('fetchUser', 1);   // Gọi action
this.$store.commit('INCREMENT');         // Gọi mutation
this.$store.state.count;                 // Đọc state
// Vấn đề: Boilerplate cực nhiều. TypeScript support rất kém.

// ═══════════════ Pinia (Vue 3 — mới, recommended) ═══════════════
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  getters: {
    fullName: (state) => `${state.user?.firstName} ${state.user?.lastName}`,
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    // Actions SỬA STATE TRỰC TIẾP — không cần mutation!
    async fetchUser(userId: number) {
      this.loading = true;
      try {
        this.user = await api.getUser(userId);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});

// Component sử dụng:
<script setup>
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

// storeToRefs: Giữ reactivity khi destructure
const { user, loading, fullName, isLoggedIn } = storeToRefs(userStore);

// Actions gọi trực tiếp
userStore.fetchUser(1);
userStore.logout();
</script>
```

**Tại sao Pinia thay thế Vuex?**
| Tiêu chí | Vuex | Pinia |
|---|---|---|
| Mutations | Bắt buộc (boilerplate) | **KHÔNG CÓ** — action sửa state trực tiếp |
| TypeScript | Yếu (phải viết types thủ công) | **Tuyệt vời** (auto-inference) |
| Kiến trúc | 1 store lớn + modules namespace | Nhiều store nhỏ độc lập |
| DevTools | Có | Có (Pinia DevTools) |
| Bundle size | ~6KB | **~1.5KB** |
| Composition API | Hỗ trợ hạn chế | Hỗ trợ native (cũng viết được dạng setup function) |

```javascript
// Pinia với Composition API style (setup function)
export const useCounterStore = defineStore('counter', () => {
  // Giống hệt viết composable!
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  async function fetchCount() {
    count.value = await api.getCount();
  }

  return { count, doubleCount, increment, fetchCount };
});
```

---

# PHẦN B — CÂU HỎI PHỎNG VẤN & TRẢ LỜI

---

## Q1: Phân biệt cơ chế Reactivity giữa Vue 3 và React. Cái nào tốt hơn?
**Trả lời:**
- **React:** Immutable state. Cập nhật qua `setState()` → React tạo Virtual DOM mới → Diffing algorithm so sánh với VDOM cũ → Tìm sự khác biệt tối thiểu → Cập nhật DOM thật. Scope re-render: toàn bộ component subtree (trừ khi dùng `React.memo`).
- **Vue 3:** Proxy-based tracking. Vue bọc state trong Proxy để theo dõi getter/setter. Khi property thay đổi → Vue biết CHÍNH XÁC phần template nào đang dùng property đó → Chỉ cập nhật phần đó. Scope re-render: chính xác từng binding.
- **Không có cái nào "tốt hơn" tuyệt đối:** React cho developer nhiều quyền kiểm soát nhưng phải tự tối ưu. Vue tối ưu sẵn nhưng "phép thuật" nhiều hơn (khó debug khi reactivity không hoạt động đúng). Chọn dựa trên team skill và yêu cầu dự án.

## Q2: Tại sao lạm dụng \`useMemo\` / \`useCallback\` lại hại hơn lợi?
**Trả lời:**
Mỗi lần dùng memo, React phải: (1) Lưu giá trị cũ vào memory, (2) So sánh dependencies mỗi render, (3) Quản lý lifecycle của cache. Nếu phép tính rẻ hơn chi phí memo → lãng phí. Chỉ memo khi: tính toán nặng (sort/filter array lớn), truyền callback xuống `React.memo` wrapped child, dùng trong dependency array của hook khác.

## Q3: Vuex vs Pinia — Tại sao Vue 3 khuyến nghị Pinia?
**Trả lời:**
Pinia giải quyết mọi nhược điểm Vuex: (1) Bỏ Mutations — action sửa state trực tiếp, giảm 50% boilerplate. (2) TypeScript inference tuyệt vời (Vuex phải viết types thủ công). (3) Multiple stores nhỏ thay 1 store khổng lồ → code splitting, tree-shaking tốt. (4) Bundle nhỏ hơn 4 lần (~1.5KB vs ~6KB). (5) Hỗ trợ Composition API (viết store giống composable).

## Q4: CSS Repaint vs Reflow — Tại sao animation dùng \`transform\` mượt hơn \`top/left\`?
**Trả lời:**
- `top/left` thay đổi vị trí element trong Layout → trigger Reflow (tính lại vị trí TẤT CẢ elements) → Repaint → rất nặng.
- `transform` được xử lý ở tầng Composite bởi GPU, KHÔNG ảnh hưởng Layout → không Reflow, không Repaint các elements khác → mượt 60fps.
- Tương tự: `opacity` cũng chỉ trigger Composite. Luôn dùng `transform` + `opacity` cho animation.

## Q5: Race Condition trong \`useEffect\` là gì? Cách xử lý?
**Trả lời:**
Khi user navigate nhanh (VD: click profile A rồi ngay lập tức click profile B), 2 fetch requests chạy song song. Nếu request A chậm hơn B, response A đến sau → ghi đè lên data B → hiển thị sai.
- **Fix 1:** Biến cờ `let cancelled = false` trong closure, cleanup function set `cancelled = true`.
- **Fix 2:** `AbortController` — cancel HTTP request thật sự khi component unmount hoặc dependency đổi. Tiết kiệm bandwidth.

## Q6: Context API có vấn đề gì? Khi nào dùng Zustand/Redux thay thế?
**Trả lời:**
Khi BẤT KỲ value nào trong Context thay đổi, TẤT CẢ consumers re-render (kể cả consumer chỉ dùng field khác). VD: notifications update liên tục → ThemeToggle re-render vô nghĩa. Giải pháp: Tách nhiều Context nhỏ (phức tạp), hoặc dùng Zustand/Redux có selector chỉ subscribe đúng field cần. Context phù hợp cho data ít thay đổi (theme, locale, auth). State thay đổi thường xuyên → Zustand/Redux.
