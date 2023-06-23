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
        //src="http://localhost:4000/#/build" //POC cube.js query builder: https://www.notion.so/buttoninc/POC-Cube-js-dashboard-for-Analytics-path-ef2d0cda0bad454d9cac050ad5817222?pvs=4
        src="http://34.125.212.21:3000/public/dashboard/fdf8e976-1b80-44ad-ade5-5097444352db"
        style={{ overflow: "hidden", height: "100vh", width: "100%" }}
        width="100%"
        height="100%"
      />
    </>
  );
}
