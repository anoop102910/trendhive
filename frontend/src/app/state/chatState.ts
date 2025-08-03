import { create } from 'zustand';

export type User = {
  id: string;
  username: string;
  email: string
};

type ChatState = {
  currSelectedUser: User | null;
  setCurrSelectedUser: (user: User) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  currSelectedUser: null,
  setCurrSelectedUser: (user) => set({ currSelectedUser: user }),
}));
