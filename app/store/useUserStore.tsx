import { create } from "zustand";

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
  userName?: string;
  image: string;
  cover: string;
  [key: string]: any;
}

interface UserStore {
  userInfo: UserInfo | null;
  userInfoStatus: "loading" | "done" | "unauthenticated";
  setUserInfo: (user: UserInfo | null) => void;
  setUserInfoStatus: (status: "loading" | "done" | "unauthenticated") => void;
  userProfile:UserInfo | null;
  profile:UserInfo | null;
    setProfile: (profile: UserInfo | null | ((prev: UserInfo | null) => UserInfo | null)) => void;
  setUserProfile: (profile: UserInfo | null | ((prev: UserInfo | null) => UserInfo | null)) => void;

}

export const useUserStore = create<UserStore>((set) => ({
  userInfo: null,
  userInfoStatus: "unauthenticated",
  setUserInfo: (user) => set({ userInfo: user, userInfoStatus: user ? "done" : "unauthenticated" }),
  setUserInfoStatus: (status) => set({ userInfoStatus: status }),
  userProfile:null,
  profile:null,
  setProfile: (profile) =>
    set((state) => ({
      profile: typeof profile === "function" ? profile(state.profile) : profile,
    })),
  setUserProfile: (profile) =>
    set((state) => ({
      userProfile: typeof profile === "function" ? profile(state.userProfile) : profile,
    })),
}));
