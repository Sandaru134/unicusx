import NextAuth from "next-auth"
import {User, Session} from "next-auth"

declare module "next-auth" {
    interface User {
      id: string;
      index: string;
      username: string;
      prefix: string;
      name: string;
    }
  interface Session {
    user: User & {
      username:string
      prefix:string
      index:string
      id: string
      institute_id: string
    }
    token: {
        username:string
        prefix:string
        index:string
        id: string
        institute_id: string
    }
  }
}

export interface CustomUser extends User {
  id: string;
  index: string;
  username: string;
  prefix: string;
  name: string;
}