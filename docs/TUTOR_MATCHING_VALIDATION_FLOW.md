# Flow validation nghiep vu chon lop cho gia su

## Muc tieu
- Dam bao gia su chi nhin thay lop phu hop voi yeu cau cua phu huynh.
- Phan biet dieu kien cho 2 loai gia su: tu do va qua dao tao.
- Bao ve tinh toan ven, khong lo thong tin lop khong lien quan.

## Dinh nghia
- Loai gia su: TU_DO | DAO_TAO
- Lop hoc (class) co cac truong chinh:
  - subject, grade, district, schedule, feePerHour, status
- Yeu cau phu huynh (request):
  - subject, grade, district, schedule, budgetPerHour, tutorType
- tutorType: TU_DO | DAO_TAO | ANY (neu phu huynh khong gioi han)

## Nguyen tac phan quyen
1) Gia su TU_DO chi nhin thay lop co tutorType = TU_DO hoac ANY.
2) Gia su DAO_TAO chi nhin thay lop co tutorType = DAO_TAO hoac ANY.
3) Khong duoc phep xem chi tiet lop khong thoa dieu kien.
4) Tat ca kiem tra deu thuc hien o server, UI chi hien thi.

## Flow validation tong quan
### 1) Loc lop tren danh sach (list)
- Input: tutorId, tutorType, danh sach lop (OPEN).
- Buoc kiem tra:
  1. Xac thuc token, lay tutorType.
  2. Chi lay lop OPEN.
  3. Loc theo tutorType cua lop (TU_DO, DAO_TAO, ANY).
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
### TU_DO
- Chi nhin thay lop co tutorType = TU_DO hoac ANY.
- Khong duoc nhin thay lop DAO_TAO.

### DAO_TAO
- Chi nhin thay lop co tutorType = DAO_TAO hoac ANY.
- Neu lop yeu cau chung chi/dao tao, chi DAO_TAO duoc xem.

## Bai kiem thu toi thieu
- TU_DO khong xem duoc lop DAO_TAO (list va detail).
- DAO_TAO khong xem duoc lop TU_DO (list va detail).
- Lop ONLINE khong chan district.
- Lop OFFLINE bat buoc district match.
- Khong apply duoc lop khong hop le.

## Ghi chu trien khai
- Nen co function dung chung: canViewClass(tutor, class).
- Log ly do bi tu choi de debug (khong tra ve UI).
