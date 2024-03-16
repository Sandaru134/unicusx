import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        image_url:String
        username:String
        prefix:String
    }
  interface Session {
    user: User & {
      image_url:string
      username:String
      prefix:String
    }
    token: {
        image_url:string
        username:String
        prefix:String
    }
  }
}