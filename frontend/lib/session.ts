import { encodeBase64, decodeBase64 } from '@oslojs/encoding';

export class Session {
  static createSession(rt: string, at: string, user?: any) {
    // console.log('Original Token', at);
    // console.log('Original RefreshToken', rt);
    // console.log('Original user', user);
    const encodedAccessToken = encodeBase64(new TextEncoder().encode(at));
    const encodedRefreshToken = encodeBase64(new TextEncoder().encode(rt));
    const encodedUser = encodeBase64(
      new TextEncoder().encode(JSON.stringify(user))
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', encodedRefreshToken);
      localStorage.setItem('accessToken', encodedAccessToken);
      localStorage.setItem('user', encodedUser);
    }
  }

  static getSession(key: 'accessToken' | 'refreshToken'): string | null {
    if (typeof window === 'undefined') return null;
    const encoded = localStorage.getItem(key);
    if (!encoded) return null;
    try {
      const decoded = decodeBase64(encoded);
      return new TextDecoder().decode(decoded);
    } catch {
      return null;
    }
  }

  static getUser() {
    if (typeof window === 'undefined') return null;

    const encodedUser = localStorage.getItem('user');
    if (!encodedUser) return null;

    try {
      const decoded = decodeBase64(encodedUser);
      const userString = new TextDecoder().decode(decoded);
      return {
        user: JSON.parse(userString),
        rt: this.getSession('refreshToken'),
        at: this.getSession('accessToken'),
      };
    } catch {
      return null;
    }
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
