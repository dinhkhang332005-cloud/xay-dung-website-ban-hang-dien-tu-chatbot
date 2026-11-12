import { z} from "zod"
 export const registerSchema = z.object({
    name : z
    .string()
    .min(2,{message: "Họ cà tên ít nhất có hai kí tự "})
    .max(50,{message:" Họ và tên không được vượt quá 50 kí tự"}),

    email : z
    .string()
    .email({message:"Địa chỉ email không đúng với định dạng(ví dụ :user@gamil.com)"}),

    password :z
    .string()
    .min(8,{message:"Mật khẩu và bảo mật phải có ít nhất 8 kí tự"})
    .regex (/[A-Z]/,{message:"Phải có ít nhất một chữ cái viết hoa "})
    .regex (/[a-z]/,{message:"Phải có ít nhất một chữ cái viết thường "})
    .regex (/[0-9]/,{message:"Phải có ít nhất một chữ số "})
    .regex (/[^A-Za-z0-9]/,{message:"Phải có ít nhất một kí tự đặc biệt "}),


    
    phoneNumber : z
    .string()
    .regex(/^[0-9]{10}$/,{message:"Số điện thoại phải gồm 10 số"})
    .optional()
    .or(z.literal("")),

    address: z
    .string()
    .max(200, { message: "Địa chỉ giao hàng tối đa 200 ký tự" })
    .optional()
    .or(z.literal("")),

 })


export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Địa chỉ email không đúng định dạng (ví dụ: user@gmail.com)" }),

  password: z
    .string()
    .min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Địa chỉ email không đúng định dạng (ví dụ: user@gmail.com)"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Mã xác thực không hợp lệ hoặc đã hết hạn"),
    password: z
      .string()
      .min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự" })
      .regex(/[A-Z]/, { message: "Phải có ít nhất một chữ cái viết hoa" })
      .regex(/[a-z]/, { message: "Phải có ít nhất một chữ cái viết thường" })
      .regex(/[0-9]/, { message: "Phải có ít nhất một chữ số" })
      .regex(/[^A-Za-z0-9]/, { message: "Phải có ít nhất một ký tự đặc biệt" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận lại mật khẩu mới" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp với mật khẩu mới",
    path: ["confirmPassword"], 
  });

  // 5. Kiểm tra dữ liệu Cập nhật thông tin cá nhân (UC-08)
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Họ và tên ít nhất có 2 ký tự" })
    .max(50, { message: "Họ và tên không được vượt quá 50 ký tự" }),

  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Số điện thoại phải gồm đúng 10 chữ số" })
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, { message: "Địa chỉ giao hàng tối đa 200 ký tự" })
    .optional()
    .or(z.literal("")),
});

// 6. Kiểm tra dữ liệu Đổi mật khẩu trong trang cá nhân (UC-08)
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Vui lòng nhập mật khẩu hiện tại" }),

    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự" })
      .regex(/[A-Z]/, { message: "Phải có ít nhất một chữ cái viết hoa" })
      .regex(/[a-z]/, { message: "Phải có ít nhất một chữ cái viết thường" })
      .regex(/[0-9]/, { message: "Phải có ít nhất một chữ số" })
      .regex(/[^A-Za-z0-9]/, { message: "Phải có ít nhất một ký tự đặc biệt" }),

    confirmNewPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận lại mật khẩu mới" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu mới xác nhận không trùng khớp",
    path: ["confirmNewPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

