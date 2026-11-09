import prisma from "@/lib/prisma";
import { LoginInput, RegisterInput } from "@/validations/auth.schema";
import bcrypt from "bcryptjs";


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



}

export const authService = new AuthService();