/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { signIn } from "@/auth";

export async function authenticate(email: string, password: string) {
  console.log(">>>>>>>>>> authenticate function called with:", {
    email,
    password,
  });

  try {
    console.log(">>>>>>>>>> calling signIn...");
    const result = await signIn("credentials", {
      email: email, // Sử dụng username field cho NextAuth
      password: password,
      redirect: false,
    });
    console.log(
      ">>>>>>>>>> check result from action.ts",
      JSON.stringify(result)
    );
    return result;
  } catch (error) {
    // console.log(">>>>>>>>>> check error from action.ts", error);
    if ((error as any).name === "InvalidEmailPasswordError") {
      return {
        error: "Invalid credentials",
        statusCode: 401,
      };
    }
    if ((error as any).name === "InactiveAccountError") {
      return {
        error: "Inactive account",
        statusCode: 401,
      };
    }
    return {
      error: "Internal server error",
      statusCode: 500,
    };
  }
}
