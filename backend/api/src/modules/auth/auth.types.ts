export type UserRole = "ADMIN" | "SUPERADMIN" | "TUTOR";

export type TokenPayload = {
  sub: string;
  role: UserRole;
  email: string;
  typ: "access" | "refresh";
};

export type AuthUser = {
  id: string;
  role: UserRole;
  email: string;
  fullName: string;
  mustChangePassword?: boolean;
};
