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
export interface GenericPostBody<T> {
  data: {
    attributes: T;
    // type: "User Authentication";
    type: string;
  };
}

export interface GenericPatchBody<T> {
  data: {
    attributes: T;
    id: string;
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
  // redirect_to: string;
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
  visibility: string;
}

export interface ChangeUserRoleAttributes {
  role: string;
}

export interface MarkNotificationAttributes{
  status: string
}

export interface VerifyOtpAttributes{
  code: string,
  id: string,
  token: string,
}

export type UserAuthenticationData = GenericPostBody<UserAuthenticationAttributes>;
export type UserRegisterData = GenericPostBody<UserRegisterAttributes>;
export type UserSignOutData = GenericPostBody<UserSignOutAttributes>;
export type ResetPasswordData = GenericPostBody<ResetPassAttributes>;
export type ConfirmResetPasswordData = GenericPostBody<ConfirmPasswordResetAttributes>;
export type CreatePreSignedUrlData = GenericPostBody<CreatePreSignedUrlAttributes>;
export type ChangeUserRoleData = GenericPatchBody<ChangeUserRoleAttributes>;
export type MarkNotificationData = GenericPatchBody<MarkNotificationAttributes>;
export type VerifyOtpData = GenericPostBody<VerifyOtpAttributes>;


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
