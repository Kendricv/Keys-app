import {create} from 'zustand';
import { UserType } from '../lib/userType';

type UsersState = {
  users: UserType[];
  addUser: (user: UserType) => void;
  removeUser: (user_id: string) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  addUser: (newUser) => set((state) => {
    if (state.users.some(user => user.user_id === newUser.user_id)) {
      return state;
    }
    return { users: [...state.users, newUser] };
  }),
  removeUser: (user_id) => set((state) => ({ users: state.users.filter(u => u.user_id !== user_id) })),
}));
