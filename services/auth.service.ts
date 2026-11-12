import prisma from "@/lib/prisma";
import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "@/validations/auth.schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/mail";

export class AuthService {
    async registerUser(data : RegisterInput){
        const {name ,email,password,phoneNumber, address} = data;
        const normalizedEmail = email.toLowerCase().trim();
         const existingUser = await prisma.user.findUnique({
            where :{email :normalizedEmail},
         });

         if(existingUser){
            const error = new Error("EMAIL_EXISTS");
            throw error;
         }

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = await prisma.$transaction(async(tx)=>{
        const user = await tx.user.create({
            data :{
                name : name.trim(),
                email:normalizedEmail,
                password:hashedPassword,
                phoneNumber:phoneNumber||null,
                address : address||null,
                role:"USER"
            },
        });

        await tx.cart.create({
            data:{
                userId:user.id,
            },
        });

        return user;

    });

    return {
        id:newUser.id,
        name:newUser.name,
        email:newUser.email,
        role:newUser.role,
        createdAt : newUser.createdAt,
    };
}

    async loginUser (data : LoginInput){
        const {email,password} = data;
        const normalizedEmail = email.toLocaleLowerCase().trim();

         const user  = await prisma.user.findUnique({
            where :{email:normalizedEmail},
         });
         if(!user||!user.password){
            throw new Error("INVALID_CREDENTIALS");
         }

         const isPasswordMatch = await bcrypt.compare(password, user.password);
         if (!isPasswordMatch) {
            throw new Error("INVALID_CREDENTIALS");
        }
        
         return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address,
         }
    }

        async requestPasswordReset ( data : ForgotPasswordInput){
        const {email} = data;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
            where :{email:normalizedEmail},
        });

        if(!user || !user.password){
            return{
                message:"Nếu email tồn tại trên hệ thống, đường link khôi phục đã được gửi đi.",
            };
        }

        const expiresAt = Date.now()+15*60*1000;
        const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key";
        const signatureData = `${user.id}:${user.password}:${expiresAt}`;
        const signature = crypto
            .createHmac("sha256", secret)
            .update(signatureData)
            .digest("hex");

        const resetToken = `${user.id}.${expiresAt}.${signature}`;
        const resetUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        // 🚀 GỬI EMAIL THẬT VÀO HÒM THƯ CỦA NGƯỜI DÙNG
        try {
            await sendResetPasswordEmail({
                to: user.email,
                userName: user.name || "Quý khách",
                resetUrl,
            });
        } catch (mailError) {
            console.error("Lỗi gửi email:", mailError);
        }

        // Vẫn in dự phòng ra Terminal để bạn dễ quan sát
        console.log("==================================================");
        console.log("🔗 LINK ĐẶT LẠI MẬT KHẨU (HẾT HẠN TRONG 15 PHÚT):");
        console.log(resetUrl);
        console.log("==================================================");

        return {
            message: "Đường link đặt lại mật khẩu đã được gửi đến email của bạn! Vui lòng kiểm tra hộp thư đến (hoặc hòm thư rác).",
        };
    }

        async resetPassword(data: ResetPasswordInput) {
        const { token, password } = data;

        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("INVALID_TOKEN");
        }

        const [userId, expiresAtStr, signature] = parts;
        const expiresAt = parseInt(expiresAtStr, 10);

        if (Date.now() > expiresAt) {
            throw new Error("TOKEN_EXPIRED");
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.password) {
            throw new Error("USER_NOT_FOUND");
        }

        const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key";
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${user.id}:${user.password}:${expiresAt}`)
            .digest("hex");

        if (signature !== expectedSignature) {
            throw new Error("INVALID_TOKEN");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return {
            message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.",
        };
    }



}

export const authService = new AuthService();