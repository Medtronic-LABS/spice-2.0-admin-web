export const PUBLIC_ROUTES = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  privacyPolicy: '/privacy-policy'
};

export const PROTECTED_ROUTES = {
  home: '/region/:regionId/:tenantId'
};
