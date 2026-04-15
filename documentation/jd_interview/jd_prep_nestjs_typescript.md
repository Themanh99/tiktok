# NestJS & TypeScript — Kiến Thức Chuyên Sâu (Mid/Senior)

> Tài liệu này bao gồm kiến thức nền tảng cần học trước, sau đó là các câu hỏi phỏng vấn kèm câu trả lời chi tiết.

---

# PHẦN A — KIẾN THỨC NỀN TẢNG CẦN HỌC

---

## I. TypeScript Nâng Cao

### 1.1 Tại sao phải dùng TypeScript?
JavaScript là ngôn ngữ Dynamic Typing (kiểu dữ liệu động) — biến có thể mang bất kỳ kiểu nào vào bất kỳ lúc nào. Điều này gây ra rất nhiều bug chỉ phát hiện được lúc Runtime (lúc chạy thật). TypeScript được Microsoft tạo ra như một "lớp áo giáp" bọc lên JavaScript, bổ sung hệ thống kiểu tĩnh (Static Type System). 

Lợi ích thực tế:
- **Phát hiện lỗi ngay từ lúc viết code** (compile-time) thay vì đợi tới khi app chạy mới biết.
- **IDE hỗ trợ cực mạnh:** Autocomplete thông minh, gợi ý props/methods, Ctrl+Click nhảy đến định nghĩa.
- **Tài liệu sống:** Đọc kiểu dữ liệu của function parameters và return type là hiểu ngay function đó cần gì, trả về gì mà không cần đọc comment.
- **Refactor an toàn:** Khi đổi tên 1 field, TypeScript tự động báo đỏ tất cả các nơi đang dùng field cũ.

### 1.2 Type vs Interface

```typescript
// --- Interface ---
interface User {
  id: number;
  name: string;
  email: string;
}

// Interface có thể mở rộng (Declaration Merging)
// Nếu 2 nơi cùng khai báo interface User, TS sẽ TỰ ĐỘNG GỘP chúng lại
interface User {
  avatar?: string; // Giờ User có thêm avatar
}

// Interface dùng extends để kế thừa
interface Admin extends User {
  role: 'admin' | 'superadmin';
  permissions: string[];
}

// --- Type ---
type Product = {
  id: number;
  name: string;
  price: number;
};

// Type KHÔNG Declaration Merging được (báo lỗi trùng tên)
// Type dùng & (Intersection) để kết hợp
type ProductWithDiscount = Product & {
  discountPercent: number;
};

// Type làm được những điều Interface KHÔNG làm được:
type Status = 'active' | 'inactive' | 'banned';     // Union của literals
type Coordinate = [number, number];                   // Tuple
type Callback = (data: string) => void;               // Function type
type StringOrNumber = string | number;                 // Union types
```

**Quy tắc thực tế:**
- Dùng **Interface** khi mô tả hình dạng (shape) của Object, Class, hoặc API response.
- Dùng **Type** khi cần Union, Tuple, Function type, hoặc kết hợp phức tạp.
- Trong dự án NestJS, DTO (Data Transfer Object) thường dùng **Class** (vì class-validator cần class thật để validate runtime).

### 1.3 Generics (Kiểu Tổng Quát)
Generics cho phép bạn viết code "linh hoạt kiểu dữ liệu" mà vẫn an toàn. Thay vì viết 10 hàm giống nhau cho 10 kiểu dữ liệu, bạn viết 1 hàm Generic.

```typescript
// Không dùng Generic → phải viết nhiều hàm hoặc dùng any (mất type safety)
function getFirstString(arr: string[]): string { return arr[0]; }
function getFirstNumber(arr: number[]): number { return arr[0]; }

// Dùng Generic → 1 hàm duy nhất, TypeScript tự suy luận kiểu
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const name = getFirst(['Alice', 'Bob']);     // TypeScript biết: name là string
const age = getFirst([25, 30]);              // TypeScript biết: age là number

// Generic với constraint (ràng buộc)
// T phải có property "id"
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Generic trong Interface (rất phổ biến cho API response)
interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
}

// Sử dụng:
type UserResponse = ApiResponse<User>;
// → { data: User; statusCode: number; message: string; timestamp: string; }

type ProductListResponse = ApiResponse<Product[]>;
// → { data: Product[]; statusCode: number; ... }
```

### 1.4 Utility Types (Kiểu Tiện Ích)
TypeScript cung cấp sẵn các "công cụ biến đổi kiểu" cực kỳ mạnh. Đây là phần bị hỏi rất nhiều ở mức Mid/Senior.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// ──────────────────────────────────────────
// 1. Partial<T> — Biến TẤT CẢ properties thành optional (?)
// ──────────────────────────────────────────
type UpdateUserDto = Partial<User>;
// Kết quả: { id?: number; name?: string; email?: string; ... }
// Use case: API endpoint PATCH /users/:id — client chỉ gửi những field muốn update

// ──────────────────────────────────────────
// 2. Required<T> — Ngược lại Partial, bắt TẤT CẢ phải có
// ──────────────────────────────────────────
type MandatoryUser = Required<Partial<User>>;
// Biến mọi field optional trở lại bắt buộc

// ──────────────────────────────────────────
// 3. Pick<T, Keys> — Trích xuất CHỈ những field cần
// ──────────────────────────────────────────
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;
// Kết quả: { id: number; name: string; email: string; }
// Use case: API trả về danh sách user chỉ cần hiển thị tên + email

// ──────────────────────────────────────────
// 4. Omit<T, Keys> — Loại BỎ những field không muốn
// ──────────────────────────────────────────
type SafeUser = Omit<User, 'password'>;
// Kết quả: { id: number; name: string; email: string; role: ...; createdAt: ... }
// Use case: TUYỆT ĐỐI không trả về password cho Frontend

// ──────────────────────────────────────────
// 5. Record<Keys, Type> — Tạo Object Map nhanh
// ──────────────────────────────────────────
type RolePermissions = Record<'admin' | 'user' | 'moderator', string[]>;
// Kết quả: { admin: string[]; user: string[]; moderator: string[]; }

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  user: ['read'],
  moderator: ['read', 'write', 'delete'],
};

// Dùng Record để tạo dictionary/lookup map
type UserMap = Record<string, User>; // key là string (userId), value là User

// ──────────────────────────────────────────
// 6. ReturnType<T> — Lấy kiểu trả về của function
// ──────────────────────────────────────────
function createUser(name: string, email: string) {
  return { id: Date.now(), name, email, createdAt: new Date() };
}
type CreatedUser = ReturnType<typeof createUser>;
// Tự động suy luận ra: { id: number; name: string; email: string; createdAt: Date }

// ──────────────────────────────────────────
// 7. Readonly<T> — Chỉ đọc, không sửa được
// ──────────────────────────────────────────
type FrozenUser = Readonly<User>;
// Mọi property đều readonly, gán lại sẽ báo lỗi compile
```

### 1.5 \`any\` vs \`unknown\` vs \`never\`

```typescript
// ═══════════════ any ═══════════════
// "Tắt TypeScript" cho biến này. Compiler bỏ qua mọi kiểm tra.
let dangerous: any = "hello";
dangerous.thisMethodDoesNotExist(); // ✅ Compiler cho qua → CRASH lúc runtime!
dangerous = 42;
dangerous = { foo: 'bar' };
// → Lười thì dùng, nhưng mất hết lợi ích TypeScript. Senior KHÔNG BAO GIỜ dùng any.

// ═══════════════ unknown ═══════════════
// "Type-safe any" — nhận mọi giá trị nhưng BẮT BUỘC kiểm tra kiểu trước khi dùng
let safe: unknown = "hello";
// safe.toUpperCase(); // ❌ LỖI! TypeScript không cho dùng method khi chưa kiểm tra

// Phải dùng Type Guard:
if (typeof safe === 'string') {
  safe.toUpperCase(); // ✅ OK — TypeScript biết chắc đây là string
}

// Use case thực tế: Parse JSON từ API, đọc file, nhận data từ bên thứ 3
async function fetchData(url: string): Promise<unknown> {
  const res = await fetch(url);
  return res.json(); // Chưa biết shape → trả về unknown
}

// ═══════════════ never ═══════════════
// Kiểu "không bao giờ xảy ra" — hàm throw error, vòng lặp vô hạn
function throwError(message: string): never {
  throw new Error(message); // Hàm này KHÔNG BAO GIỜ return
}

// Dùng never để kiểm tra exhaustive (xử lý hết mọi case)
type Shape = 'circle' | 'square' | 'triangle';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle': return Math.PI * 10 * 10;
    case 'square': return 10 * 10;
    case 'triangle': return (10 * 10) / 2;
    default:
      // Nếu sau này thêm 'rectangle' vào Shape mà quên xử lý ở switch,
      // TypeScript sẽ báo lỗi ở dòng này vì 'rectangle' không gán được cho never
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

### 1.6 Type Guard (Bảo vệ kiểu)

```typescript
// typeof guard
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // TS biết value là string
  }
  return value.toFixed(2); // TS biết value là number
}

// instanceof guard
class Dog { bark() { return 'Woof!'; } }
class Cat { meow() { return 'Meow!'; } }

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    return animal.bark();
  }
  return animal.meow();
}

// Custom Type Guard (is keyword) — rất phổ biến trong NestJS
interface SuccessResponse { data: any; status: 'success'; }
interface ErrorResponse { error: string; status: 'error'; }
type ApiResult = SuccessResponse | ErrorResponse;

function isSuccess(result: ApiResult): result is SuccessResponse {
  return result.status === 'success';
}

// Sử dụng:
function handleResult(result: ApiResult) {
  if (isSuccess(result)) {
    console.log(result.data); // TS biết đây là SuccessResponse
  } else {
    console.error(result.error); // TS biết đây là ErrorResponse
  }
}
```

### 1.7 Decorators (Bộ trang trí)
Decorator là cú pháp đặc biệt của TypeScript (cần bật `experimentalDecorators` trong tsconfig). NestJS xây dựng TOÀN BỘ kiến trúc dựa trên Decorator.

```typescript
// Decorator thực chất là một HÀM nhận tham số là class/method/property
// và có thể THAY ĐỔI hành vi của chúng

// Class Decorator
function Controller(prefix: string) {
  return function (target: Function) {
    // Gắn metadata "route prefix" vào class
    Reflect.defineMetadata('prefix', prefix, target);
  };
}

// Method Decorator
function Get(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('method', 'GET', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

// Trong NestJS, bạn dùng như thế này:
@Controller('users')        // Decorator class → route prefix là /users
export class UsersController {
  @Get(':id')                // Decorator method → GET /users/:id
  findOne(@Param('id') id: string) { // Decorator parameter
    return this.usersService.findOne(id);
  }
}
```

---

## II. Kiến Trúc NestJS

### 2.1 NestJS là gì và tại sao chọn NestJS?
NestJS là framework backend Node.js được xây dựng hoàn toàn bằng TypeScript. Lấy cảm hứng từ Angular (Google), áp dụng kiến trúc Module-based và nguyên lý SOLID. 

**So sánh Express.js (minimal) vs NestJS (opinionated):**
| Tiêu chí | Express.js | NestJS |
|---|---|---|
| Triết lý | Tối giản, tự do cấu trúc | Có kiến trúc chuẩn sẵn |
| TypeScript | Phải tự cấu hình | Hỗ trợ gốc (native) |
| Dependency Injection | Không có | Có sẵn IoC Container |
| Cấu trúc folder | Developer tự quyết | Module → Controller → Service (chuẩn) |
| Validation | Tự cài middleware | Pipes + class-validator tích hợp |
| Testing | Tự setup Jest | Tích hợp sẵn testing module, dễ mock |
| Swagger/OpenAPI | Tự cài plugin | `@nestjs/swagger` auto-generate từ DTO |
| WebSocket, GraphQL, gRPC | Tự tích hợp | Module chính thức hỗ trợ |

**Khi nào dùng gì?**
- **Express:** Prototype nhanh, API nhỏ 5-10 endpoints, microservice cực nhỏ.
- **NestJS:** Dự án lớn, team nhiều người, cần chuẩn code thống nhất, cần scale và maintain lâu dài.

### 2.2 Module System (Hệ thống Module)
Module là đơn vị tổ chức code cốt lõi trong NestJS. Mỗi tính năng (feature) nên được gói gọn trong 1 module riêng.

```
src/
├── app.module.ts              ← Root Module (gốc, import tất cả module con)
├── users/
│   ├── users.module.ts        ← UsersModule
│   ├── users.controller.ts    ← Xử lý HTTP routes /users/*
│   ├── users.service.ts       ← Business logic
│   ├── dto/
│   │   ├── create-user.dto.ts ← Validate body khi tạo user
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts     ← Định nghĩa bảng DB (TypeORM/Prisma)
├── auth/
│   ├── auth.module.ts         ← AuthModule
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── products/
│   ├── products.module.ts
│   ├── ...
└── common/
    ├── filters/               ← Exception Filters dùng chung
    ├── interceptors/          ← Interceptors dùng chung
    ├── pipes/                 ← Custom Pipes
    └── decorators/            ← Custom Decorators
```

```typescript
// users.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Import Entity để dùng Repository
    AuthModule,                         // Import module khác nếu cần dùng service của nó
  ],
  controllers: [UsersController],       // Khai báo controllers thuộc module này
  providers: [UsersService],            // Khai báo services (providers) thuộc module này
  exports: [UsersService],              // Export ra cho module KHÁC có thể inject UsersService
})
export class UsersModule {}

// app.module.ts (Root Module)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Biến ConfigModule thành Global
    TypeOrmModule.forRoot({ ... }),            // Kết nối Database
    UsersModule,                               // Đăng ký UsersModule
    AuthModule,
    ProductsModule,
  ],
})
export class AppModule {}
```

**Quy tắc quan trọng:**
- Nếu Module A muốn dùng `UsersService` của Module B, thì Module B phải **exports** `UsersService`, và Module A phải **imports** `UsersModule`.
- Module đánh dấu `@Global()` hoặc `isGlobal: true` sẽ tự động khả dụng ở mọi nơi mà không cần import (nhưng đừng lạm dụng, chỉ nên dùng cho Config, Database).

### 2.3 Dependency Injection (DI) và IoC Container

**Inversion of Control (IoC - Đảo ngược quyền điều khiển):**
Trong lập trình truyền thống, bạn tự tạo object:
```typescript
// ❌ Cách truyền thống — Coupling chặt, khó test
class UsersController {
  private usersService: UsersService;

  constructor() {
    // Controller tự tạo service → phụ thuộc cứng
    this.usersService = new UsersService(
      new UserRepository(new DatabaseConnection('postgres://...'))
    );
  }
}
```

Với IoC, framework đảm nhận việc khởi tạo:
```typescript
// ✅ NestJS — IoC Container tự inject
@Controller('users')
class UsersController {
  // Chỉ cần khai báo trong constructor,
  // NestJS IoC Container sẽ TỰ tìm và inject UsersService vào
  constructor(private readonly usersService: UsersService) {}
}
```

**Dependency Injection (DI):**
DI là kỹ thuật thực hiện IoC. Thay vì class tự tạo dependencies, dependencies được "tiêm" (inject) từ bên ngoài vào qua constructor.

**Cách NestJS IoC Container hoạt động bên dưới:**
1. Khi app khởi động, Nest đọc tất cả `@Module()` decorators.
2. Với mỗi module, Nest đọc mảng `providers` và tạo một "bản đồ" (container) lưu trữ: Key = Token (thường là tên Class), Value = Instance.
3. Khi cần tạo instance của `UsersController`, Nest nhìn vào constructor, thấy cần `UsersService`.
4. Nest tìm trong container: "Ai đã register với token `UsersService`?" → Tìm thấy → Inject vào.
5. Mặc định, mỗi provider là **Singleton** — chỉ tạo 1 lần, dùng chung cho cả app.

**Lợi ích thực tế của DI:**
- **Unit Test dễ dàng:** Khi test `UsersController`, bạn inject một mock `UsersService` giả thay vì service thật. Không cần kết nối DB thật.
- **Loose Coupling:** Controller không biết và không quan tâm service được tạo ra sao, dùng DB gì.
- **Dễ thay thế:** Muốn đổi từ PostgreSQL sang MongoDB? Chỉ cần tạo một service mới implement cùng interface, swap trong module.

```typescript
// Unit Test với DI — inject mock service
const module = await Test.createTestingModule({
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useValue: {
        findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Mock User' }]),
        findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Mock User' }),
      },
    },
  ],
}).compile();

const controller = module.get<UsersController>(UsersController);
const result = await controller.findAll();
expect(result).toHaveLength(1); // Test mà không cần DB thật!
```

### 2.4 Provider Scopes (Phạm vi vòng đời Provider)
NestJS có 3 scope quản lý vòng đời instance:

| Scope | Vòng đời | Khi nào dùng | Nhược điểm |
|---|---|---|---|
| **DEFAULT** (Singleton) | Tạo 1 lần khi app boot, dùng mãi | 99% trường hợp. Service stateless. | Không nên lưu state đặc thù per-request |
| **REQUEST** | Tạo mới mỗi HTTP request | Cần truy cập request context (VD: multi-tenant, user-specific logic) | Chậm hơn vì phải tạo/hủy liên tục, GC nặng |
| **TRANSIENT** | Tạo mới mỗi lần inject | Logger riêng cho mỗi service, stateful utility | Tốn memory, ít dùng |

```typescript
// Request Scope
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(@Inject(REQUEST) private request: Request) {
    // Truy cập được request object hiện tại
    // Hữu ích cho multi-tenant: this.request.headers['x-tenant-id']
  }
}

// ⚠️ CHÚ Ý: Khi 1 provider là REQUEST scope, 
// TẤT CẢ providers phụ thuộc vào nó cũng bị kéo thành REQUEST scope
// → Ảnh hưởng hiệu năng toàn chuỗi dependency
```

### 2.5 Custom Providers (Provider tùy chỉnh)
Ngoài cách đăng ký provider đơn giản bằng class, NestJS cho phép nhiều cách đăng ký linh hoạt:

```typescript
@Module({
  providers: [
    // 1. Standard — đăng ký class bình thường
    UsersService,
    // Tương đương với: { provide: UsersService, useClass: UsersService }

    // 2. useClass — đổi implementation
    // Hữu ích khi muốn dùng class khác tùy environment
    {
      provide: PaymentService,
      useClass: process.env.NODE_ENV === 'production'
        ? StripePaymentService
        : MockPaymentService,
    },

    // 3. useValue — inject một giá trị cố định (config, constant)
    {
      provide: 'API_KEY',
      useValue: 'sk_live_abc123',
    },

    // 4. useFactory — tạo provider bằng hàm factory (có thể async)
    // Factory có thể inject các provider khác
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return createConnection(dbConfig);
      },
      inject: [ConfigService], // Inject ConfigService vào factory function
    },

    // 5. useExisting — tạo alias cho provider đã có
    {
      provide: 'AliasedService',
      useExisting: UsersService,
    },
  ],
})
```

---

## III. Request Lifecycle (Vòng Đời Request trong NestJS)

Đây là kiến thức **CỰC KỲ QUAN TRỌNG**. Khi một HTTP request đi vào server NestJS, nó sẽ đi qua các tầng theo thứ tự chính xác sau:

```
Request HTTP đến
     │
     ▼
┌─────────────────┐
│   MIDDLEWARE     │  ← Chạy đầu tiên (giống Express middleware)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     GUARDS      │  ← Kiểm tra quyền truy cập (Auth, Role)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  INTERCEPTORS   │  ← Trước Controller (transform request, cache, logging)
│   (Pre-handler) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     PIPES       │  ← Validate & Transform data (DTO validation)
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  CONTROLLER HANDLER │  ← Xử lý business logic
└────────┬────────────┘
         │
         ▼
┌─────────────────┐
│  INTERCEPTORS   │  ← Sau Controller (format response, logging thời gian)
│  (Post-handler) │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  EXCEPTION FILTERS  │  ← Bắt exception ở BẤT KỲ tầng nào phía trên
└────────┬────────────┘
         │
         ▼
   Response HTTP
```

### 3.1 Middleware

```typescript
// Middleware chạy ĐẦU TIÊN, trước mọi thứ khác
// Giống hệt Express middleware: (req, res, next) => {}
// Use case: Logging, CORS xử lí riêng, Rate limiting, Request tracking

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    console.log(`[${req.method}] ${req.url} — Started`);

    // Khi response kết thúc, log thời gian xử lý
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.url} — ${res.statusCode} — ${duration}ms`);
    });

    next(); // GỌI NEXT để chuyển tiếp, nếu không gọi → request bị treo!
  }
}

// Đăng ký middleware trong Module
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'health', method: RequestMethod.GET }) // Bỏ qua health check
      .forRoutes('*'); // Áp dụng cho tất cả routes
  }
}
```

### 3.2 Guards (Cổng bảo vệ)

```typescript
// Guards quyết định request có ĐƯỢC PHÉP đi tiếp hay không
// Return true → cho qua. Return false hoặc throw → chặn lại.
// Chạy SAU middleware, TRƯỚC interceptors và pipes.

// ── JWT Authentication Guard ──
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token không tồn tại');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // Gắn user info vào request để dùng ở controller
      return true;
    } catch {
      throw new UnauthorizedException('Token hết hạn hoặc không hợp lệ');
    }
  }
}

// ── Role-based Authorization Guard ──
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Đọc metadata @Roles('admin', 'moderator') từ controller method
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // Nếu không yêu cầu role → cho qua

    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
    }
    return true;
  }
}

// ── Custom Decorator để gắn role metadata ──
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// ── Sử dụng trong Controller ──
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng cả 2 guards
export class AdminController {
  @Get('dashboard')
  @Roles('admin', 'superadmin') // Chỉ admin và superadmin mới vào được
  getDashboard() {
    return { message: 'Welcome to admin dashboard' };
  }
}
```

### 3.3 Interceptors (Bộ chặn)

```typescript
// Interceptor chặn TRƯỚC và SAU controller handler
// Use case: Format response thống nhất, Caching, Logging thời gian, Transform data

// ── Response Transform Interceptor ──
// Bọc mọi response thành format chuẩn: { data, statusCode, message, timestamp }
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallableFunction): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        data: data,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Success',
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
// → Mọi API response sẽ tự động được bọc:
// { "data": { "id": 1, "name": "Alice" }, "statusCode": 200, "message": "Success", ... }

// ── Performance Logging Interceptor ──
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(context: ExecutionContext, next: CallableFunction): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`${request.method} ${request.url} — ${duration}ms`);

        // Cảnh báo nếu API chậm
        if (duration > 3000) {
          this.logger.warn(`⚠️ SLOW API: ${request.url} took ${duration}ms`);
        }
      }),
    );
  }
}

// ── Cache Interceptor (Ví dụ đơn giản) ──
@Injectable()
export class SimpleCacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; expiry: number }>();

  intercept(context: ExecutionContext, next: CallableFunction): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = request.url;
    const cached = this.cache.get(key);

    // Nếu có cache và chưa hết hạn → trả về luôn, KHÔNG vào controller
    if (cached && cached.expiry > Date.now()) {
      return of(cached.data);
    }

    // Không có cache → vào controller, lưu kết quả lại
    return next.handle().pipe(
      tap((data) => {
        this.cache.set(key, { data, expiry: Date.now() + 60000 }); // Cache 60s
      }),
    );
  }
}
```

### 3.4 Pipes (Ống dẫn — Validate & Transform)

```typescript
// Pipes xử lý data TRƯỚC KHI vào controller handler
// 2 nhiệm vụ chính: Validation (kiểm tra) và Transformation (ép kiểu)

// ── Built-in Pipes ──
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // ParseIntPipe tự chuyển string "123" → number 123
  // Nếu id là "abc" → tự trả lỗi 400 Bad Request
  return this.usersService.findOne(id);
}

@Get(':uuid')
findByUuid(@Param('uuid', ParseUUIDPipe) uuid: string) {
  // Validate format UUID, nếu sai → 400
}

// ── DTO Validation với class-validator ──
// Đây là cách phổ biến nhất trong dự án NestJS thật
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên không được quá 50 ký tự' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'Role phải là admin hoặc user' })
  role?: 'admin' | 'user';
}

// Bật ValidationPipe global trong main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Tự động XÓA properties không có trong DTO
    forbidNonWhitelisted: true,// Nếu gửi field lạ → báo lỗi 400
    transform: true,           // Tự ép kiểu (string "1" → number 1)
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  await app.listen(3000);
}

// Controller nhận DTO đã được validate
@Post()
create(@Body() createUserDto: CreateUserDto) {
  // Nếu body request thiếu name hoặc email sai format,
  // ValidationPipe đã chặn và trả 400 trước khi vào đây
  return this.usersService.create(createUserDto);
}
```

**Tại sao dùng `whitelist: true` và `forbidNonWhitelisted: true`?**
Đây là biện pháp bảo mật quan trọng. Nếu không bật, hacker có thể gửi thêm field `role: "admin"` trong body request tạo user → nâng quyền trái phép. Với `whitelist`, mọi field không khai báo trong DTO sẽ bị loại bỏ tự động.

### 3.5 Exception Filters (Bộ lọc ngoại lệ)

```typescript
// Exception Filter là TẤM LƯỚI CUỐI CÙNG
// Bắt mọi Exception chưa được xử lý ở các tầng trên
// Chuyển thành JSON response lịch sự cho Frontend

// ── Global Exception Filter ──
@Catch() // @Catch() không có argument = bắt TẤT CẢ exception
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi hệ thống nội bộ';
    let details: any = null;

    if (exception instanceof HttpException) {
      // Lỗi HTTP do NestJS throw (400, 401, 403, 404, ...)
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message;
      details = typeof exceptionResponse === 'object' ? exceptionResponse : null;
    } else if (exception instanceof Error) {
      // Lỗi runtime không mong đợi (bug code, null pointer, ...)
      message = exception.message;
      // Log stack trace đầy đủ để debug
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
      );
    }

    // Trả response chuẩn cho Frontend
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(details && { details }),
    });
  }
}

// Đăng ký global trong main.ts
app.useGlobalFilters(new GlobalExceptionFilter());

// Hoặc đăng ký qua DI (để filter có thể inject service khác)
@Module({
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
```

---

## IV. Các Khái Niệm Nâng Cao NestJS

### 4.1 Custom Decorators

```typescript
// Tạo decorator @CurrentUser() để lấy user từ request
// Thay vì viết @Req() req → req.user ở mọi controller

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // Nếu có data (VD: @CurrentUser('email')), trả về field cụ thể
    return data ? user?.[data] : user;
  },
);

// Sử dụng:
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: User) {
  return user; // Lấy toàn bộ user object
}

@Get('my-email')
@UseGuards(JwtAuthGuard)
getEmail(@CurrentUser('email') email: string) {
  return { email }; // Chỉ lấy email
}
```

### 4.2 Configuration Management (Quản lý cấu hình)

```typescript
// NestJS ConfigModule — quản lý env variables an toàn

// .env file
// DATABASE_HOST=localhost
// DATABASE_PORT=5432
// JWT_SECRET=my-super-secret-key
// JWT_EXPIRATION=3600

// config/database.config.ts
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME || 'myapp',
}));

// config/jwt.config.ts
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: parseInt(process.env.JWT_EXPIRATION, 10) || 3600,
}));

// Inject config vào service
@Injectable()
export class AuthService {
  constructor(
    @Inject('jwt') private jwtConfig: { secret: string; expiresIn: number },
  ) {}
}
```

---

# PHẦN B — CÂU HỎI PHỎNG VẤN & TRẢ LỜI

---

## Q1: NestJS quản lý dependencies như thế nào? Giải thích DI và IoC.
**Trả lời:**
- **IoC (Inversion of Control):** Là nguyên lý framework chủ động kiểm soát vòng đời và khởi tạo object, thay vì developer tự viết `new`. Developer chỉ khai báo "tôi cần cái gì", framework lo phần "tạo ra và cung cấp".
- **DI (Dependency Injection):** Là design pattern thực thi IoC. Dependencies không được tạo bên trong class mà được "tiêm" từ bên ngoài qua constructor. Khi constructor của `UsersController` khai báo `UsersService`, IoC Container tự tìm, khởi tạo (nếu chưa có), cache lại (Singleton) và inject instance đó vào.
- **Lợi ích thực tế:** Loose coupling (giảm phụ thuộc cứng), dễ Unit Test (inject mock), dễ swap implementation (đổi Database mà không sửa controller).

## Q2: Trình bày thứ tự Request Lifecycle trong NestJS.
**Trả lời:**
Middleware → Guards → Interceptors (trước handler) → Pipes → Controller Handler → Interceptors (sau handler) → Exception Filters (bắt lỗi ở mọi tầng).
- **Middleware:** Logging, tracking, rate limit.
- **Guards:** Xác thực JWT token, kiểm tra role/permissions. Return false → chặn ngay.
- **Interceptors (trước):** Cache check, modify request.
- **Pipes:** Validate DTO (class-validator), transform data type.
- **Controller:** Xử lý business logic.
- **Interceptors (sau):** Format response chuẩn, log performance.
- **Exception Filters:** Tấm lưới cuối bắt mọi unhandled exception, trả JSON error lịch sự.

## Q3: Phân biệt các loại Provider Scope. Khi nào dùng Request Scope?
**Trả lời:**
- **DEFAULT (Singleton):** 1 instance cho cả app. Dùng 99% — service stateless, không lưu data theo request.
- **REQUEST:** Instance mới cho mỗi HTTP request. Dùng khi cần truy cập request context (multi-tenant lấy tenant từ header, logging per-request). Cẩn thận: mọi provider phụ thuộc cũng bị kéo thành request scope → giảm hiệu năng.
- **TRANSIENT:** Instance mới mỗi lần inject. Rất ít dùng, chỉ khi cần state riêng cho mỗi consumer (VD: Logger riêng cho mỗi service).

## Q4: Utility Types nào hay dùng nhất trong dự án NestJS? Cho ví dụ thực tế.
**Trả lời:**
- `Omit<User, 'password'>` → tạo `SafeUser` không bao giờ trả password cho FE.
- `Partial<CreateUserDto>` → tạo `UpdateUserDto` cho PATCH endpoint (mọi field optional).
- `Pick<User, 'id' | 'name' | 'email'>` → tạo `UserPreview` cho API list chỉ hiện tên.
- `Record<string, Permission[]>` → tạo permission map theo role.
- `ReturnType<typeof someFunction>` → tự suy luận return type của function phức tạp.

## Q5: \`any\` vs \`unknown\` — tại sao Senior không dùng \`any\`?
**Trả lời:**
- `any` tắt hoàn toàn TypeScript compiler cho biến đó. Gọi method không tồn tại → compiler cho qua → crash runtime.
- `unknown` nhận mọi giá trị nhưng BẮT BUỘC dùng Type Guard (`typeof`, `instanceof`, custom guard) trước khi gọi method. An toàn hơn nhiều.
- Thực tế: Parse JSON API response → `unknown`, không bao giờ `any`. Dùng `any` = thừa nhận bạn không kiểm soát được kiểu dữ liệu.

## Q6: Tại sao ValidationPipe cần bật \`whitelist: true\`?
**Trả lời:**
Đây là biện pháp bảo mật. Nếu không bật, hacker gửi `{ "name": "Alice", "role": "admin" }` trong body tạo user → field `role` lọt thẳng vào DB nếu Entity có field `role`. Với `whitelist: true`, mọi field KHÔNG có trong DTO class sẽ tự động bị strip. Với `forbidNonWhitelisted: true`, gửi field lạ sẽ bị trả lỗi 400 ngay lập tức.

## Q7: Giải thích cách tạo Custom Decorator lấy current user trong NestJS.
**Trả lời:**
Dùng `createParamDecorator` tạo `@CurrentUser()`. Bên trong, lấy request từ `ExecutionContext`, trả về `request.user` (đã được Guard gắn vào trước đó). Thay vì mọi controller phải viết `@Req() req` rồi `req.user`, chỉ cần `@CurrentUser() user: User`. Code gọn, type-safe, reusable.
