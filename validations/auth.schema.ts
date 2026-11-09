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


export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

