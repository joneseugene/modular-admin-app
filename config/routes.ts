export const ROUTES = {
  auth: {
    login: "/login",
  },
  admin: {
    dashboard: "/dashboard",
    users: "/users",
    roles: "/roles",
    features: "/features",
  },
} as const;

export type AppRoute =
  | typeof ROUTES.auth.login
  | typeof ROUTES.admin.dashboard
  | typeof ROUTES.admin.users
  | typeof ROUTES.admin.roles
  | typeof ROUTES.admin.features;