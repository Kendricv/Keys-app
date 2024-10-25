import { create } from 'zustand';
import { UserType } from '../lib/userType';

type UsersState = {
  user: UserType;
  saveUser: (user: UserType) => void;
};

export const useSessionStore = create<UsersState>((set) => ({
  user: { user_id: '1', full_name: '', email: '', rol: '', dpi: '', lastname: '', tel: '', username: '' },
  saveUser: (newUser) =>
    set(() => ({
      user: newUser,
    })),
}));
