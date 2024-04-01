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
    // type: "User Authentication";
    type: string;
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

export interface ResetPassAttributes {
  email: string;
}

export interface ConfirmPasswordResetAttributes {
  password: string;
  token: string;
}

export interface CreatePreSignedUrlAttributes {
  filename: string;
  mime: string;
  original_filename: string;
  size: number;
  type: string;
}

export type UserAuthenticationData = UserData<UserAuthenticationAttributes>;
export type UserRegisterData = UserData<UserRegisterAttributes>;
export type UserSignOutData = UserData<UserSignOutAttributes>;
export type ResetPasswordData = UserData<ResetPassAttributes>;
export type ConfirmResetPasswordData = UserData<ConfirmPasswordResetAttributes>;
export type CreatePreSignedUrlData = UserData<CreatePreSignedUrlAttributes>;


export interface ApiResponse{
  message: string;
  error: boolean;
  result: any;
  processing: boolean;
}

export interface ApiResponseStatus{
  message: string;
  success: any;
  result: any;
  processing: boolean;
}
