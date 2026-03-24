GIAI ĐOẠN 1: Nâng cao React & State Management (Ưu tiên số 1 - Học kỹ)
JD yêu cầu: Reactjs, Redux, Flux, Asynchronous request handling, AJAX
Vì bạn đã biết React, giờ là lúc nâng cấp nó lên chuẩn "1 năm kinh nghiệm":
Flux Architecture:
Không cần code, chỉ cần đọc để hiểu khái niệm (Action -> Dispatcher -> Store -> View). Đây là kiến trúc nền tảng mà Redux dựa vào.
Redux & Redux Toolkit (RTK):
Học cách quản lý State toàn cục.
Bắt buộc phải học Redux Toolkit (cách viết Redux hiện đại) thay vì Redux thuần (cũ và dài dòng).
Asynchronous & AJAX trong React:
Học cách gọi API: Dùng fetch API và thư viện Axios.
Hiểu rõ Promise, async/await.
Biết cách dùng useEffect để fetch data, xử lý các trạng thái: loading, success, error (partial page updates - cập nhật một phần trang web mà không load lại trang).
GIAI ĐOẠN 2: Kỹ năng Styling Nâng cao & Tương thích Trình duyệt (Học kỹ)
JD yêu cầu: CSS pre-processing, Bootstrap, Cross-browser compatibility
CSS Pre-processors (SASS/SCSS):
(Lưu ý: JD ghi "server-side CSS pre-processing... such as Reactjs" là HR viết sai. Thực chất đó là SASS, LESS).
Hãy học SASS/SCSS. Học cách dùng Variables (biến), Nesting (viết CSS lồng nhau), Mixins. Rất dễ vì bạn đã biết CSS.
Framework CSS (Bootstrap):
Học Bootstrap 5 (Grid system, các component có sẵn như Modal, Navbar, Button...). Tích hợp thử react-bootstrap vào project.
Cross-browser compatibility (Tương thích trình duyệt):
Hiểu khái niệm: Vendor prefixes (thêm -webkit-, -moz- vào CSS).
Biết cách dùng caniuse.com để check xem thuộc tính CSS có chạy được trên Safari, IE, Chrome không.
Responsive Web Design (Media queries).
GIAI ĐOẠN 3: Công cụ quản lý mã nguồn & Tối ưu hóa (Học kỹ)
JD yêu cầu: Git, SVN, SEO principles
Git (Bắt buộc):
Học các lệnh cơ bản: clone, add, commit, push, pull.
Học cách làm việc nhóm: Tạo branch, xử lý merge conflict, tạo Pull Request.
SVN (Học lướt):
Đây là công cụ quản lý code rất cũ. Chỉ cần dành 1 buổi đọc khái niệm (Checkout, Commit, Update) để biết nó khác Git chỗ nào (Centralized vs Distributed). Không cần đào sâu.
SEO Principles cho Frontend:
Học về Semantic HTML (Dùng thẻ <article>, <section>, <nav> thay vì toàn dùng <div>).
Hiểu về Meta tags (Title, Description, Open Graph cho Facebook/Twitter).
Biết nhược điểm của React (SPA) với SEO và giải pháp (như dùng Next.js hoặc Server-Side Rendering - chỉ cần biết khái niệm để chém gió lúc phỏng vấn).
GIAI ĐOẠN 4: Các công nghệ Legacy & Kỹ năng phụ (Học Lướt / Biết để phỏng vấn)
JD yêu cầu: jQuery, BackboneJS, KnockoutJS, DurandalJS, Image tools
jQuery:
Hiện tại React đã thay thế jQuery, nhưng dự án công ty này có thể là dự án cũ (maintain).
Nên học: Các selector cơ bản ($()), cách gắn sự kiện (click, hover), và cách gọi $.ajax. (Học trong 2-3 ngày là đủ).
BackboneJS, KnockoutJS, DurandalJS:
🚨 CẢNH BÁO: Đây là những framework đồ cổ (đã chết hoặc cực ít người dùng).
Chiến thuật: Tuyệt đối KHÔNG code thực hành tốn thời gian. Hãy dành đúng 1 buổi lên mạng đọc kiến trúc của chúng (VD: Knockout dùng MVVM, Backbone dùng MVP) để nếu người phỏng vấn hỏi: "Em biết gì về KnockoutJS?" -> Bạn trả lời: "Em biết nó là thư viện binding data 2 chiều giống Vue/Angular ngày nay, tuy em chưa dùng trong dự án thực tế nhưng em có thể đọc hiểu tài liệu nhanh chóng vì tư duy frontend tương đồng nhau".
Image authoring tools (Photoshop / Gimp / Figma):
Không cần thành Designer. Chỉ cần tải Photoshop (hoặc dùng Figma - khuyên dùng) học cách:
Cắt ảnh (Crop).
Đổi kích thước (Resize).
Nén ảnh để tối ưu dung lượng web (Export for Web / WebP format).
