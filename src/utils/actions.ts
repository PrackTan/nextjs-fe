/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
  try {
    const result = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    console.log(
      ">>>>>>>>>> check result from action.ts",
      JSON.stringify(result)
    );
    return result;
  } catch (error) {
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
