"use client";
import { getError } from "@/lib/actions";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type LoginFormData = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isLoading, isSubmitted },
  } = useForm<LoginFormData>({
    defaultValues: { rememberMe: true },
  });
  const router = useRouter();
  // const loading = isSubmitting || isLoading || isSubmitted;

  useEffect(() => {
    // استرجاع البيانات المخزنة في الكوكيز عند تحميل الصفحة
    const savedUsername = Cookies.get("username");
    const savedPassword = Cookies.get("password");
    if (savedUsername && savedPassword) {
      setValue("username", savedUsername);
      setValue("password", savedPassword);
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      if (result?.error) {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة.");
      } else {
        if (data.rememberMe) {
          Cookies.set("username", data.username);
          Cookies.set("password", data.password);
        } else {
          Cookies.remove("username");
          Cookies.remove("password");
        }
        router.push("/");
      }
    } catch (error: any) {
      console.log(getError(error));
      toast.error(getError(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          مرحبا بكم في تطبيق تجديد الباقة
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* username Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              اسم المستخدم
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.username ? "border-red-500" : ""
              }`}
              id="username"
              type="text"
              placeholder="ادخل اسم المستخدم"
              {...register("username", { required: "اسم المستخدم مطلوب" })}
            />
            {errors.username && <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              كلمة المرور
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : ""
              }`}
              id="password"
              type="password"
              placeholder="ادخل كلمة المرور"
              {...register("password", { required: "كلمة المرور مطلوبة" })}
            />
            {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              defaultChecked
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="text-gray-700 text-md">
              تذكرني
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between gap-1">
            <button
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              تسجيل الدخول
            </button>
            {isSubmitting && <p className="text-black">جار تسجيل الدخول...</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
