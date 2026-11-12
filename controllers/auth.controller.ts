import { authService } from "@/services/auth.service";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "@/validations/auth.schema";
import { NextRequest, NextResponse } from "next/server";


export const  AuthController = {
    createRegister : async(req:NextRequest)=>{
        try{
        const body = await req.json();
        const validationsResult = registerSchema.safeParse(body);
        if(!validationsResult.success){
            return NextResponse.json({message:"Dữ liệu nhập vào không hợp lệ",
                                      error:validationsResult.error.flatten().fieldErrors,}
            ,{status:400}
        );
        }

        const newUser = await authService.registerUser(validationsResult.data);

        return NextResponse.json({message:"Chúc mừng bạn đăng kí tài khoản thành công ",user:newUser},{status:201})}
        catch(error: any){
            if ( error.message=="EMAIL_EXISTS"){
                return NextResponse.json({message:"Địa chỉ emial đã được sử dụng vui lòng chọn email khác !"},{status:409});
            }
            console.error("Lỗi Controller Đăng ký:", error);
            return NextResponse.json(
            { message: "Hệ thống gặp sự cố máy chủ nội bộ. Vui lòng thử lại sau!" },
            { status: 500 } // Internal Server Error
      );
        }
    },

    login : async(req:NextRequest)=>{
        try{
            const body = await req.json();
            const validationsResult = loginSchema.safeParse(body);
            if (!validationsResult.success) {
                return NextResponse.json(
                    {
                        message: "Dữ liệu nhập vào không hợp lệ",
                        errors: validationsResult.error.flatten().fieldErrors,
                    },
                    { status: 400 } 
                );
            }
        const user = await authService.loginUser(validationsResult.data);
        return NextResponse.json(
                {
                    message: "Đăng nhập thành công!",
                    user,
                },
                { status: 200 } // OK
            );

        }
        catch(error:any){
            if (error.message === "INVALID_CREDENTIALS") {
                return NextResponse.json(
                    { message: "Email hoặc mật khẩu không chính xác" },
                    { status: 401 } // 401 Unauthorized (Không được phép truy cập)
                );
            }
            // Lỗi hệ thống máy chủ
            console.error("Lỗi Controller Đăng nhập:", error);
            return NextResponse.json(
                { message: "Hệ thống gặp sự cố máy chủ nội bộ. Vui lòng thử lại sau!" },
                { status: 500 } // Internal Server Error
            );
        }
    },

        // 3. Controller: Quên Mật Khẩu
    forgotPassword: async (req: NextRequest) => {
        try {
            const body = await req.json();

            const validation = forgotPasswordSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json(
                    {
                        message: "Dữ liệu nhập vào không hợp lệ",
                        errors: validation.error.flatten().fieldErrors,
                    },
                    { status: 400 }
                );
            }

            const result = await authService.requestPasswordReset(validation.data);
            return NextResponse.json(result, { status: 200 });
        } catch (error: any) {
            console.error("Lỗi Controller Quên mật khẩu:", error);
            return NextResponse.json(
                { message: "Hệ thống gặp sự cố máy chủ nội bộ. Vui lòng thử lại sau!" },
                { status: 500 }
            );
        }
    },

    // 4. Controller: Đặt Lại Mật Khẩu Mới
    resetPassword: async (req: NextRequest) => {
        try {
            const body = await req.json();

            const validation = resetPasswordSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json(
                    {
                        message: "Dữ liệu nhập vào không hợp lệ",
                        errors: validation.error.flatten().fieldErrors,
                    },
                    { status: 400 }
                );
            }

            const result = await authService.resetPassword(validation.data);
            return NextResponse.json(result, { status: 200 });
        } catch (error: any) {
            if (error.message === "TOKEN_EXPIRED") {
                return NextResponse.json(
                    { message: "Đường link đã hết hạn (chỉ có hiệu lực trong 15 phút). Vui lòng gửi lại yêu cầu mới!" },
                    { status: 400 }
                );
            }

            if (error.message === "INVALID_TOKEN") {
                return NextResponse.json(
                    { message: "Mã xác thực không hợp lệ hoặc đã qua sử dụng!" },
                    { status: 400 }
                );
            }

            if (error.message === "USER_NOT_FOUND") {
                return NextResponse.json(
                    { message: "Không tìm thấy tài khoản người dùng!" },
                    { status: 404 }
                );
            }

            console.error("Lỗi Controller Đặt lại mật khẩu:", error);
            return NextResponse.json(
                { message: "Hệ thống gặp sự cố máy chủ nội bộ. Vui lòng thử lại sau!" },
                { status: 500 }
            );
        }
    },
}