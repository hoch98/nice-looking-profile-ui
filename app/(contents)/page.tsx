// page.tsx of / root page

import { auth, signOut } from "@/auth";

export default async function Page() {
  const userSession = await auth();

  return (
    <main>
      <div className="">
        hello
      </div>
    </main>
  );
}
