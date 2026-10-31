export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  ssoCallback: "/sso-callback",
  onboarding: "/onboarding",
  goalDetail: (goalId: string) => `/goals/${goalId}`,
} as const
