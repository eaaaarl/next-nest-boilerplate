export class Session {
  static createSession(rt: string, at: string, user: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', rt);
      localStorage.setItem('accessToken', at);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  static getSession() {
    if (typeof window === 'undefined') return null;
    return {
      rt: localStorage.getItem('refreshToken'),
      at: localStorage.getItem('accessToken'),
    };
  }

  static getUser() {
    if (typeof window === 'undefined') return null;
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      rt: localStorage.getItem('refreshToken'),
      at: localStorage.getItem('accessToken'),
    };
  }
  static destroySession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  static isAuthenticated() {
    return (
      typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
    );
  }
}
