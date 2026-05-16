import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { SignInForm } from "./SignInForm";

export const metadata = { title: "Sign in · PokeHub" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  if (session?.user) redirect(callbackUrl ?? "/");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Sign in</h1>
      <SignInForm callbackUrl={callbackUrl} initialError={error} />
      <p className="mt-6 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href={
            callbackUrl
              ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/signup"
          }
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </main>
  );
}
