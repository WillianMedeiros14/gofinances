import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { logInAsync } from'expo-google-app-auth';
import { AuthProvider, useAuth } from './auth';

jest.mock('expo-google-app-auth');

describe('Auth Hook', () => {
    it('should be able to sign in with Goolge account existing', async () => {
        const googleMocked = mocked(logInAsync as any);
        googleMocked.mockReturnValue({
            type: 'success',
            user: {
                id: 'any_id',
                email: 'medeiros@gmail.com',
                name: 'Medeiros',
                photo: 'any_photo.png'
            }
        });
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user.email).toBe('medeiros@gmail.com');
    });

    it('user should not connect if cancel authentication with Goolge', async () => {
        const googleMocked = mocked(logInAsync as any);
        googleMocked.mockReturnValue({
            type: 'cancel',
        });
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user).not.toHaveProperty('id');
    });
});