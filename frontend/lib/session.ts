import { encodeBase64, decodeBase64 } from '@oslojs/encoding';

export class Session {
  static createSession(rt: string, at: string, user?: any) {
    try {
      const encodedAccessToken = encodeBase64(new TextEncoder().encode(at));
      const encodedRefreshToken = encodeBase64(new TextEncoder().encode(rt));
      const encodedUser = encodeBase64(
        new TextEncoder().encode(JSON.stringify(user))
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', encodedRefreshToken);
        localStorage.setItem('accessToken', encodedAccessToken);
        localStorage.setItem('user', encodedUser);

        // Force an update by manually triggering the storage event
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'accessToken',
            newValue: encodedAccessToken,
          })
        );

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create session:', error);
      return false;
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

    window.dispatchEvent(new Event('storage'));
  }

  static isAuthenticated() {
    return (
      typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
    );
  }
}
