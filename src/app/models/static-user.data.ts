export interface StaticUser {
  id: string;
  name: string;
  username: string;
  gmail: string;
  password: string;
}

export const STATIC_USER: StaticUser = {
  id: 'local-user-001',
  name: 'Tejas Dhame',
  username: 'tejasdhame05',
  gmail: 'tejasdhame05@gmail.com',
  password: '12345678',
};

export const STATIC_APP_VERSION = '1.0.0-static';
