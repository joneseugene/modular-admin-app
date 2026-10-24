export const ROUTES = {
  welcome: "/welcome",
  forbidden: "/forbidden",
  notfound: "notfound",
  auth: {
    login: "/login",
    register: "/register",
    forgot_password: "/forgot-password",
    change_password: "/change-password",
  },
  admin: {
    dashboard: "/dashboard",
    users: "/users",
    roles: "/roles",
    features: "/features",
    profile: "/profile",
  },
} as const;

export type AppRoute =
  | typeof ROUTES.auth.login
  | typeof ROUTES.forbidden
  | typeof ROUTES.admin.dashboard
  | typeof ROUTES.admin.users
  | typeof ROUTES.admin.roles
  | typeof ROUTES.admin.features;
