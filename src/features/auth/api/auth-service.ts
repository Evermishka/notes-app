import type { User } from '@/entities/user';

export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Здесь будет реальный вызов Firebase Auth
    // await Firebase.auth().signInWithEmailAndPassword(email, password);

    // Пока оставляем симуляцию
    await new Promise((resolve) => setTimeout(resolve, 200));

    const isValidCredentials = email === 'test@example.com' && password === 'password';

    if (!isValidCredentials) {
      throw new Error('WRONG_CREDENTIALS');
    }

    return {
      user: {
        id: `user_${Date.now()}`,
        email,
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
      },
      token: `token_${Date.now()}`,
    };
  }
}
