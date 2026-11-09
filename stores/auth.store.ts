
import {create} from "zustand"

export interface AuthUser {
    id:string;
    name : string;
    email:string;
    role :"USER"|"ADMIN"|"SUPPORT";
    phoneNumber?: string | null;
    address?: string | null;
}

interface AuthState {
    user:AuthUser| null;
    isHydrated : boolean;
    setUser : (user:AuthUser|null)=>void;
    logout:()=>void;
    initAuth:()=>void;
}

export const useAuthStore = create<AuthState>
((set)=>({
    user:null,
    isHydrated : false,
    setUser:(user)=>{
if(user){
    localStorage.setItem("user",JSON.stringify(user));
}
    else {
        localStorage.removeItem("user");
    }
    set({user});
    },
    logout:()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        set({user:null});
    },
    initAuth:()=>{
        if (typeof window !=="undefined"){
            const storedUser = localStorage.getItem("user");
            if(storedUser){
                try{
                    set({user:JSON.parse(storedUser),isHydrated:true});
                    return
                } catch{
                    localStorage.removeItem("user");
                }
            }
            set({isHydrated:true})
        }
    },
}),)
