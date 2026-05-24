# 1.Flow validation nghiep vu chon lop cho gia su

## Muc tieu
- Dam bao gia su chi nhin thay lop phu hop voi yeu cau cua phu huynh.
- Phan biet dieu kien cho 3 loai nguoi day: gia su tu do, gia su dao tao, giao vien trung tam.
- Bao ve tinh toan ven, khong lo thong tin lop khong lien quan.

## Dinh nghia
- Loai nguoi day: GIA_SU_TU_DO | GIA_SU_DAO_TAO | GIAO_VIEN_TRUNG_TAM
- Lop hoc (class) co cac truong chinh:
  - subject, grade, district, schedule, feePerHour, status
- Yeu cau phu huynh (request):
  - subject, grade, district, schedule, budgetPerHour, tutorType
- tutorType: GIA_SU_TU_DO | GIA_SU_DAO_TAO | GIAO_VIEN_TRUNG_TAM | ANY (neu phu huynh khong gioi han)

## Nguyen tac phan quyen
1) Gia su tu do chi nhin thay lop co tutorType = GIA_SU_TU_DO hoac ANY.
2) Gia su dao tao chi nhin thay lop co tutorType = GIA_SU_DAO_TAO hoac ANY.
3) Giao vien trung tam chi nhin thay lop co tutorType = GIAO_VIEN_TRUNG_TAM hoac ANY.
4) Khong duoc phep xem chi tiet lop khong thoa dieu kien.
5) Tat ca kiem tra deu thuc hien o server, UI chi hien thi.

## Flow validation tong quan
### 1) Loc lop tren danh sach (list)
- Input: tutorId, tutorType, danh sach lop (OPEN).
- Buoc kiem tra:
  1. Xac thuc token, lay tutorType.
  2. Chi lay lop OPEN.
  3. Loc theo tutorType cua lop (GIA_SU_TU_DO, GIA_SU_DAO_TAO, GIAO_VIEN_TRUNG_TAM, ANY).
  4. Loc theo tieu chi phu huynh:
     - subject phu hop
     - grade phu hop
     - district phu hop (neu lop offline)
     - schedule phu hop (neu phu huynh co yeu cau cu the)
     - feePerHour nam trong budgetPerHour neu co ngan sach.
  5. Tra ve danh sach da loc.

### 2) Xem chi tiet lop (detail)
- Input: tutorId, classId.
- Buoc kiem tra:
  1. Xac thuc token.
  2. Lay class theo classId.
  3. Kiem tra class.status = OPEN.
  4. Kiem tra tutorType hop le voi class.tutorType.
  5. Kiem tra class thoa tieu chi phu huynh (nhu list).
  6. Neu bat ky buoc nao fail -> 403.

### 3) Ung tuyen nhan lop (apply)
- Input: tutorId, classId.
- Buoc kiem tra:
  1. Thuc hien cac kiem tra nhu detail.
  2. Kiem tra tutor da ung tuyen chua.
  3. Kiem tra so luong ung vien toi da (neu co).
  4. Tao application voi status = PENDING.
  5. Tra ve trang thai thanh cong.

## Chi tiet validation theo tieu chi phu huynh
### Subject
- Must match: tutor.subjects chua subject cua lop.
- Neu lop cho phep nhieu mon, chi can 1 mon khop.

### Grade
- tutor.grades hoac tutor.level phai phu hop lop.
- Dinh nghia mapping cap do neu can (VD: THCS bao gom lop 6-9).

### District
- Neu class.mode = OFFLINE thi tutor.districts phai chua class.district.
- Neu class.mode = ONLINE thi bo qua district.

### Schedule
- Neu phu huynh co yeu cau thu/khung gio, class.schedule phai giao nhau.
- Neu class.schedule null -> cho phep, nhung danh dau can xac nhan.

### Fee
- Neu phu huynh co budgetPerHour, class.feePerHour <= budgetPerHour.
- Neu phu huynh khong nhap ngan sach -> bo qua.

## Quy tac rieng theo loai gia su
### GIA_SU_TU_DO
- Chi nhin thay lop co tutorType = GIA_SU_TU_DO hoac ANY.
- Khong duoc nhin thay lop GIA_SU_DAO_TAO hoac GIAO_VIEN_TRUNG_TAM.

### GIA_SU_DAO_TAO
- Chi nhin thay lop co tutorType = GIA_SU_DAO_TAO hoac ANY.
- Neu lop yeu cau chung chi/dao tao, chi GIA_SU_DAO_TAO duoc xem.

### GIAO_VIEN_TRUNG_TAM
- Chi nhin thay lop co tutorType = GIAO_VIEN_TRUNG_TAM hoac ANY.
- Khong thay lop gia su.

## Bai kiem thu toi thieu
- GIA_SU_TU_DO khong xem duoc lop GIA_SU_DAO_TAO va GIAO_VIEN_TRUNG_TAM.
- GIA_SU_DAO_TAO khong xem duoc lop GIA_SU_TU_DO va GIAO_VIEN_TRUNG_TAM.
- GIAO_VIEN_TRUNG_TAM khong xem duoc lop GIA_SU_TU_DO va GIA_SU_DAO_TAO.
- Lop ONLINE khong chan district.
- Lop OFFLINE bat buoc district match.
- Khong apply duoc lop khong hop le.

## Ghi chu trien khai
- Nen co function dung chung: canViewClass(tutor, class).
- Log ly do bi tu choi de debug (khong tra ve UI).

---

# 2.BA Flow dang ky lop: 3 loai nguoi day

## Pham vi
- Co 3 loai lop: LOP_GIA_SU_TU_DO, LOP_GIA_SU_DAO_TAO, LOP_TRUNG_TAM.
- LOP_TRUNG_TAM gan voi giao vien trung tam do admin tao tai khoan.
- Admin co danh sach va man hinh rieng cho tung loai lop.

## Dinh nghia bo sung
- classType: LOP_GIA_SU_TU_DO | LOP_GIA_SU_DAO_TAO | LOP_TRUNG_TAM
- tutorType: GIA_SU_TU_DO | GIA_SU_DAO_TAO | GIAO_VIEN_TRUNG_TAM | ANY
- centerTeacherId (chi ap dung cho LOP_TRUNG_TAM)
- requestType: GIA_SU_TU_DO | GIA_SU_DAO_TAO | TRUNG_TAM (gan voi yeu cau dang ky)

## Nguyen tac phan loai lop
1) Phu huynh chon 1 trong 2 form: Form gia su hoac Form hoc trung tam.
2) Neu chon Form gia su, phu huynh tiep tuc chon loai: GIA_SU_TU_DO hoac GIA_SU_DAO_TAO.
3) Neu chon Form hoc trung tam, loai mac dinh = TRUNG_TAM.
4) He thong tao requestType theo form/loai phu huynh chon.
5) Khi admin duyet va tao lop, classType phai giong requestType.
6) tutorType phai phu hop classType tuong ung.
7) centerTeacherId chi co nghia khi classType = LOP_TRUNG_TAM.

## Flow dang ky (phu huynh)
### A) Dang ky lop gia su tu do
1. Phu huynh chon loai lop = GIA_SU_TU_DO.
2. Nhap thong tin mon hoc, cap lop, khu vuc, lich hoc, hoc phi/buoi.
3. He thong tao requestType = GIA_SU_TU_DO, tutorType = GIA_SU_TU_DO.
4. Trang thai request = PENDING.

### B) Dang ky lop gia su dao tao
1. Phu huynh chon loai lop = GIA_SU_DAO_TAO.
2. Nhap thong tin mon hoc, cap lop, khu vuc, lich hoc, hoc phi/buoi.
3. He thong tao requestType = GIA_SU_DAO_TAO, tutorType = GIA_SU_DAO_TAO.
4. Trang thai request = PENDING.

### C) Dang ky lop tai trung tam
1. Phu huynh chon loai lop = TRUNG_TAM.
2. Nhap thong tin mon hoc, cap lop, khu vuc, lich hoc, hoc phi/buoi.
3. He thong tao requestType = TRUNG_TAM, tutorType = GIAO_VIEN_TRUNG_TAM.
4. Trang thai request = PENDING.

## Admin: Phan tach man hinh
### 1) Muc "Yeu cau gia su tu do"
- Chi hien requestType = GIA_SU_TU_DO.
- Hanh dong: duyet -> tao LOP_GIA_SU_TU_DO.

### 2) Muc "Yeu cau gia su dao tao"
- Chi hien requestType = GIA_SU_DAO_TAO.
- Hanh dong: duyet -> tao LOP_GIA_SU_DAO_TAO.

### 3) Muc "Yeu cau lop trung tam"
- Chi hien requestType = TRUNG_TAM.
- Hanh dong: duyet -> tao LOP_TRUNG_TAM.
- Can chon giao vien trung tam (centerTeacherId).

### 4) Muc "Lop gia su tu do"
- Chi hien classType = LOP_GIA_SU_TU_DO.
- Trang thai lop: OPEN | ASSIGNED | CLOSED.

### 5) Muc "Lop gia su dao tao"
- Chi hien classType = LOP_GIA_SU_DAO_TAO.
- Trang thai lop: OPEN | ASSIGNED | CLOSED.

### 6) Muc "Lop trung tam"
- Chi hien classType = LOP_TRUNG_TAM.
- Hien giao vien trung tam duoc gan.
- Trang thai lop: OPEN | ASSIGNED | CLOSED.

## Flow duyet va tao lop
### A) Tao LOP_GIA_SU_TU_DO
1. Admin mo requestType = GIA_SU_TU_DO.
2. Tao classType = LOP_GIA_SU_TU_DO.
3. Lop hien thi o muc "Lop gia su tu do".

### B) Tao LOP_GIA_SU_DAO_TAO
1. Admin mo requestType = GIA_SU_DAO_TAO.
2. Tao classType = LOP_GIA_SU_DAO_TAO.
3. Lop hien thi o muc "Lop gia su dao tao".

### C) Tao LOP_TRUNG_TAM
1. Admin mo requestType = TRUNG_TAM.
2. Chon giao vien trung tam tu danh sach tai khoan da tao.
3. Tao classType = LOP_TRUNG_TAM, gan centerTeacherId.
4. Lop hien thi o muc "Lop trung tam".

## Quan ly tai khoan giao vien trung tam
### Tao tai khoan
1. Admin tao tai khoan giao vien trung tam (role = CENTER_TEACHER).
2. Truong bat buoc: ho ten, email/phone, chuyen mon, khu vuc, trang thai.
3. Tao mat khau tam hoac gui link kich hoat.
4. Ghi nhan ngay tao va nguoi tao.

### Phan quyen giao vien trung tam
- Chi nhin thay lop classType = LOP_TRUNG_TAM duoc gan.
- Khong thay lop gia su.

## Validation chinh
- RequestType va classType phai nhat quan (khong duoc tao sai loai).
- LOP_GIA_SU_TU_DO bat buoc co tutorType = GIA_SU_TU_DO.
- LOP_GIA_SU_DAO_TAO bat buoc co tutorType = GIA_SU_DAO_TAO.
- LOP_TRUNG_TAM bat buoc co centerTeacherId.
- Admin UI phai tach man hinh theo classType.

## Bao cao va thong ke
- So luong yeu cau GIA_SU_TU_DO, GIA_SU_DAO_TAO, TRUNG_TAM hien rieng.
- So luong lop GIA_SU_TU_DO, GIA_SU_DAO_TAO, TRUNG_TAM hien rieng.

---

# 3.Plan trien khai BA

## Muc tieu
- Chot phan loai lop (GIA_SU_TU_DO, GIA_SU_DAO_TAO, TRUNG_TAM) va phan quyen tuong ung.
- Tach man hinh admin va danh sach lop theo classType.
- Hoan thien flow tao tai khoan giao vien trung tam.

## Pham vi (in-scope)
- RequestType va classType dong nhat.
- Loc va hien thi danh sach theo classType.
- Tao va quan ly tai khoan giao vien trung tam.
- Flow duyet lop va gan giao vien trung tam.

## Ngoai pham vi (out-of-scope)
- Tinh luong chi tiet cho giao vien trung tam.
- Quy trinh cham cong va thanh toan.
- Tu dong phan lop bang AI.

## Milestones
### M1: Chot yeu cau va tieu chi nghiep vu
- Danh sach field bat buoc cho request va class.
- Ma trang thai va quy tac chuyen trang thai.
- Quy tac hien thi va phan quyen theo classType.

### M2: Thiet ke UI/UX admin
- Menu tach: Yeu cau gia su tu do, Yeu cau gia su dao tao, Yeu cau lop trung tam.
- Menu tach: Lop gia su tu do, Lop gia su dao tao, Lop trung tam.
- Man hinh tao tai khoan giao vien trung tam.

### M3: API va validation
- API list/ detail theo classType.
- API duyet va tao lop theo requestType.
- API tao va quan ly tai khoan giao vien trung tam.
- Validation bat buoc cho centerTeacherId khi classType = LOP_TRUNG_TAM.

### M4: Testing va rollout
- Test case cho phan loai lop va loc danh sach.
- Test case cho gan giao vien trung tam.
- UAT voi admin.

## Deliverables
- Bo tai lieu BA cap nhat (file nay).
- Danh sach truong du lieu va mapping request -> class.
- Danh sach API can co va quy tac validation.
- Danh sach man hinh admin voi filter/phan quyen.

## Rui ro va giam thieu
- Rui ro nham loai lop: bat buoc classType = requestType (server).
- Rui ro thieu giao vien trung tam: can canh bao khi duyet lop.
- Rui ro UI khong tach ro: can menu va badge ro rang.

## Open questions
- Truong bat buoc cho giao vien trung tam: can them bang cap/kinh nghiem?
- Lop trung tam co cho phep apply tu giao vien tu do khong?
- Co can phan quyen xem lop trung tam cho nhom khac?

---

# 4.Implementation plan sua code theo phase va tasks

## Phase 1: DB + Prisma (Migration)
- Task 1.1: Cap nhat Prisma enum
  - requestType: GIA_SU_TU_DO | GIA_SU_DAO_TAO | TRUNG_TAM
  - classType: LOP_GIA_SU_TU_DO | LOP_GIA_SU_DAO_TAO | LOP_TRUNG_TAM
  - tutorType: GIA_SU_TU_DO | GIA_SU_DAO_TAO | GIAO_VIEN_TRUNG_TAM | ANY
- Task 1.2: Them truong centerTeacherId (nullable) vao Class
- Task 1.3: Them rang buoc logic (app-level validation)
  - classType = LOP_TRUNG_TAM thi centerTeacherId bat buoc
  - classType khac LOP_TRUNG_TAM thi centerTeacherId = null
- Task 1.4: Migration + backfill
  - Lop co centerTeacherId -> LOP_TRUNG_TAM
  - Con lai -> LOP_GIA_SU_TU_DO (tam thoi)
- Task 1.5: Them index cho requestType, classType, tutorType, status

## Phase 2: Backend API + Validation
- Task 2.1: Public form submit
  - POST /public/class-requests nhan formType (GIA_SU | TRUNG_TAM)
  - Neu formType = GIA_SU nhan tutorType (GIA_SU_TU_DO | GIA_SU_DAO_TAO)
  - Map requestType theo formType/tutorType
- Task 2.2: Admin list requests
  - GET /admin/class-requests?requestType=...
- Task 2.3: Admin convert
  - POST /admin/class-requests/{id}/convert
  - Tao classType theo requestType
  - Bat buoc centerTeacherId neu classType = LOP_TRUNG_TAM
- Task 2.4: Admin list classes
  - GET /admin/classes?classType=...
- Task 2.5: Center teacher accounts
  - POST /admin/center-teachers
  - GET /admin/center-teachers
  - PATCH /admin/center-teachers/{id}
- Task 2.6: Authorization rules
  - Gia su chi thay lop hop le theo tutorType
  - Giao vien trung tam chi thay lop LOP_TRUNG_TAM duoc gan

## Phase 3: Frontend - Public (Phu huynh)
- Task 3.1: Tach 2 form
  - Form gia su: chon loai tu do/dao tao
  - Form hoc trung tam: khong hien tutorType
- Task 3.2: Gui formType + tutorType (neu co) ve API
- Task 3.3: Hien thi text theo loai lop da chon

## Phase 4: Frontend - Admin
- Task 4.1: Menu yeu cau
  - Yeu cau gia su tu do
  - Yeu cau gia su dao tao
  - Yeu cau lop trung tam
- Task 4.2: Menu lop hoc
  - Lop gia su tu do
  - Lop gia su dao tao
  - Lop trung tam
- Task 4.3: Convert lop trung tam
  - Bat buoc chon giao vien trung tam
- Task 4.4: Man quan ly giao vien trung tam
  - Tao tai khoan
  - Danh sach va trang thai

## Phase 5: Testing + Rollout
- Task 5.1: Test case API
  - RequestType/ClassType mapping
  - Reject neu sai tutorType hoac thieu centerTeacherId
- Task 5.2: Test case UI
  - 2 form phu huynh
  - 6 menu admin (3 request, 3 class)
- Task 5.3: Release
  - Deploy migration -> backend -> frontend
  - Monitor log validation
