# Flow dang ky gia su

## Yeu cau chinh
- Chi cho phep dang ky gia su tu do va qua dao tao.
- Gia su co the chon nhieu khu vuc day.
- Gia su co the chon nhieu mon hoc day.
- Cap nhat thong tin gia su va mat khau co the tu chinh sua trong trang ho so (neu duoc phan quyen).
- Chi tao tai khoan sau khi admin duyet.

## Truong thong tin de xuat (ung vien)
- Ho ten, SDT, email
- Loai gia su: tu do | qua dao tao
- Khu vuc day: cho phep chon nhieu
- Mon hoc day: cho phep chon nhieu (map theo danh muc mon hoc)
- Lich ranh, hoc phi ky vong, kinh nghiem
- Ho so giay to (upload file hoac link)

## Flow de xuat
1) Ung vien chon loai gia su (tu do | qua dao tao)
2) Dien thong tin ho so
3) Chon nhieu khu vuc day
4) Chon nhieu mon hoc day
5) Nop ho so giay to (upload/link)
6) Gui don -> trang thai pending_review
7) Admin duyet/tu choi
8) Neu duyet -> tao tai khoan gia su, mat khau random, bat buoc doi mat khau lan dau

## Chinh sua thong tin gia su
- Trang ho so cho phep gia su tu cap nhat: thong tin ca nhan, khu vuc day, mon hoc day, lich ranh
- Admin co the chinh sua tat ca truong quan ly
- Thay doi thong tin ghi audit log (neu can)

## Yeu cau doi mat khau lan dau (first login)
- Khi tao tai khoan: set flag must_change_password = true
- Dang nhap lan dau: neu must_change_password = true
  - Ep buoc vao man hinh doi mat khau
  - Sau khi doi thanh cong: set must_change_password = false
- Neu quyen han cho phep: gia su co the doi mat khau bat ky trong trang ho so

## Pros and cons (mat khau random + bat buoc doi)
### Pros
- Bao mat cao hon so voi mat khau mac dinh/pho bien
- Giam rui ro leak danh sach tai khoan co cung mat khau
- Buoc doi mat khau lan dau giup user dat password ca nhan
- Phu hop quy trinh tao tai khoan sau duyet (admin control)

### Cons
- Can kenh gui mat khau tam (email/SMS) va xu ly truong hop that lac
- Tang them buoc UX (doi mat khau) co the lam giam ty le hoan tat
- Phai xu ly truong hop chua doi nhung can truy cap thong tin co ban

## Implementation plan (phase)
### Phase 1 - DB & Migration
- Them truong must_change_password (bool) vao Tutor
- Them truong tutor_type vao Tutor (GIA_SU_TU_DO | GIA_SU_DAO_TAO)
- Backfill: tutor pending set tutor_type, must_change_password = true neu da co tai khoan

### Phase 2 - Backend API
- Public register: bo password, nhan tutor_type, tao ho so PENDING
- Admin approve: tao password random, set must_change_password = true, gui email
- Auth login: tra ve must_change_password trong response
- Them endpoint doi mat khau va clear flag
- Chan cac endpoint nhay cam neu must_change_password = true

### Phase 3 - Frontend Main (ung vien)
- Cap nhat form dang ky gui tutor_type
- Khu vuc day, mon hoc day: multi-select/tags, map danh muc chuan
- Ho so giay to: upload hoac link

### Phase 4 - Frontend Tutor (portal)
- Neu must_change_password = true thi redirect toi doi mat khau
- Ho so gia su: cho phep cap nhat thong tin, mon hoc, khu vuc
- Doi mat khau bat ky trong trang ho so

### Phase 5 - Frontend Admin
- Duyet gia su: ghi ro mat khau tam da gui
- Hien thi loai gia su, badge mau
- Xem tai lieu ho so, cap nhat thong tin neu can

### Phase 6 - Test & Rollout
- Test API: register -> approve -> login -> change password
- Test UI: form dang ky, approve flow, first-login flow
- Deploy: migrate DB -> backend -> frontend

## Ghi chu trien khai
- Khu vuc day va mon hoc day luu quan he nhieu-nhieu
- Danh muc mon hoc dung chung cho toan he thong
- Link ho so neu dung drive: yeu cau chia se chi doc