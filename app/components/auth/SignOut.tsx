"use client";
import { ButtonProps } from "@/app/types/types";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SignOut({ buttonText }: ButtonProps) {
  //  const { data: session } = useSession();  //disabled={!session}

  useEffect(() => {
    const handleSignOut = async () => {
      // 👇️ Call the signOut function from next-auth/react to sign out the user
      const data = await signOut({ redirect: false });
      // 👇️ Redirect the user to the sign-in page
      window.location.href = "/signin";
    };

    // 👇️ Check if the code is running on the client-side
    if (typeof window !== "undefined") {
      // 👇️ Attach the sign-out action to the button click event
      const signOutButton = document.getElementById("signOutButton");
      if (signOutButton) {
        signOutButton.addEventListener("click", handleSignOut);
      }
    }
  }, []);

  return <button id="signOutButton">{buttonText}</button>;
}
