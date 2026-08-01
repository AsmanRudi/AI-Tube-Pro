"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register({
        name,
        email,
        password,
      });

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Register gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">

      <h1 className="text-3xl font-bold text-center">
        AI Tube Pro
      </h1>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Buat akun Anda
      </p>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label>Nama</label>
          <input
            className="mt-2 w-full rounded border p-3"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded border p-3"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Kata Sandi</label>
          <input
            type="password"
            className="mt-2 w-full rounded border p-3"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 py-3 text-white"
        >
          {loading ? "Memuat..." : "Daftar"}
        </button>

      </form>

      <p className="mt-6 text-center">
        Sudah punya akun?

        <Link
          href="/login"
          className="ml-2 text-blue-600"
        >
          Login
        </Link>

      </p>

    </div>
  );
}