export type User = {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatarUri?: string;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};
