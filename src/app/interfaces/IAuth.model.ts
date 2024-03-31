// export interface UserAuthenticationData {
//   data: {
//     attributes: {
//       email: string;
//       password: string;
//     };
//     type: "User Authentication";
//   };
// }
//
// export interface UserRegisterData {
//   data: {
//     attributes: {
//       email: string;
//       name: string;
//       password: string;
//     };
//     type: "User Authentication";
//   };
// }
export interface UserData<T> {
  data: {
    attributes: T;
    type: "User Authentication";
  };
}

// Example usage:
export interface UserAuthenticationAttributes {
  email: string;
  password: string;
}

export interface UserRegisterAttributes {
  email: string;
  name: string;
  password: string;
}

export interface UserSignOutAttributes {
  token: string;
}

export type UserAuthenticationData = UserData<UserAuthenticationAttributes>;
export type UserRegisterData = UserData<UserRegisterAttributes>;
export type UserSignOutData = UserData<UserSignOutAttributes>;


export interface ApiResponse{
  errorMessage: string;
  error: boolean;
  result: any;
  processing: boolean;
}
