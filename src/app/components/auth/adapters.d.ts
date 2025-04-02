import { DefaultUser } from "next-auth";


declare module 'next-auth' {
    interface AdapterUser extends DefaultUser {
        emailVerified? : boolean
      }
    
  }