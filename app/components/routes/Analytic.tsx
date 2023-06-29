import { crumbsAnalytic } from "@/utils/navigation/crumbs";

import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});
export default function Page() {
  return (
    <>
      <Tag tag={"analytic.tag"} crumbs={crumbsAnalytic}></Tag>
      <iframe
        //src="http://localhost:4000/#/build" //POC cube.js query builder: shon@pop-os:~/Workspace/Button/ct-query-builder$ npm run dev
        src="http://34.125.212.21:3000/public/dashboard/fdf8e976-1b80-44ad-ade5-5097444352db"
        style={{ overflow: "hidden", height: "100vh", width: "100%" }}
        width="100%"
        height="100%"
      />
    </>
  );
}
