import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { SignUpForm } from "./SignUpForm";

export const metadata = { title: "Sign up · PokeHub" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) redirect(callbackUrl ?? "/");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Create your account</h1>
      <SignUpForm callbackUrl={callbackUrl} />
      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href={
            callbackUrl
              ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/signin"
          }
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
