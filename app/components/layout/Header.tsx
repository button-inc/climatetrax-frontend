import { useSession } from "next-auth/react";
import Hamburger from "@/components/navigation/Hamburger";

export default function Header() {
  // 👇️ session based UX management
  const { data: session } = useSession();
  return (
    <>
      <nav className="flex py-4 px-6 border-b border-gray-200">
        <img
          src="https://uploads-ssl.webflow.com/63c84d3cdae940284f6ec702/63dddcdc6bf1b1d128596b54_ClimateTrax.png"
          loading="lazy"
          alt="logo"
          className="logoImg"
        />
        {session?.user && <Hamburger />}
      </nav>
      <style jsx>
        {`
          .logoImg {
            max-width: 20%;
          }
        `}
      </style>
    </>
  );
}
