"use client";
import { useState } from "react";
import { useTranslation } from "@/i18n/client";
import { crumbsInsight } from "@/utils/navigation/crumbs";
import { biTools } from "@/utils/insight/tools";

import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});

export default function Page() {
  // 👇️ language management
  const { t } = useTranslation("translation");

  // 👇️ show\hide state for modal message
  const [toggle, setToggle] = useState(false);

  // 👇️ handlers for onclick event
  const handleClick = (tool: string) => {
    switch (tool) {
      case "request":
        handleClickRequest();
        break;
      default:
        handleClickCopy(tool);
        break;
    }
  };

  // 👇️ handler for click: copy bi connection
  const handleClickCopy = async (tool: string) => {
    let text = "";
    switch (tool) {
      case "?TODO?":
        break;
      default:
        text = `
          \nDatabase Type: postgres
          \nDisplay name: eed GCP PG
          \nHost: http://34.125.92.26
          \nPort:5432
          \nDatabase name:eed
          \nUsername: analyst@climatetrax.com
          \nPassword: OIw0dKXAJ0xKCl`;
        break;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setToggle(!toggle);
      } else {
        fallbackCopyToClipboard(text);
        setToggle(!toggle);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  function fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }

    document.body.removeChild(textArea);
  }

  // 👇️ handler for click: request a new connection
  const handleClickRequest = () => {
    const emailTo = t("emailTo");
    const emailSubject = t("emailSubject");
    const emailBody = t("emailBody");
    window.open(
      "mailto:" + emailTo + "?subject=" + emailSubject + "&body=" + emailBody,
      "_blank"
    );
  };

  const handleClickClose = function () {
    setToggle(!toggle);
  };

  // 👇️ translations
  biTools.forEach((item) => {
    item.text = t(item.text);
  });

  // 👇️ create cards from biTools
  return (
    <>
      <Tag tag={"insight.tag"} crumbs={crumbsInsight}></Tag>
      <div className="grid gap-14 lg:grid-cols-5">
        {biTools.map((item, key) => (
          <div
            className="w-full rounded-lg shadow-md lg:max-w-sm"
            key={key}
            onClick={() => handleClick(item.tool)}
          >
            <div className="p-4">
              <div className="flex justify-center items-center">
                <img alt={item.text} src={item.src} />
              </div>
              <h5 className="text-xl text-purple-800">{item.text}</h5>
            </div>
          </div>
        ))}
      </div>

      {toggle && (
        <>
          <div className="modal">
            <button className="closemodal" onClick={handleClickClose}>
              &times;
            </button>
            <h2>📋 {t("insight.copied")} </h2>
            <p> {t("insight.text")}</p>
          </div>
          <div className="overlay"></div>
        </>
      )}
      <style jsx>
        {`
          img {
            height: 200px;
          }
          .modal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30%;

            background-color: white;
            padding: 6rem;
            border-radius: 5px;
            box-shadow: 0 3rem 5rem rgba(0, 0, 0, 0.3);
            z-index: 10;
          }

          .closemodal {
            position: absolute;
            top: 1.2rem;
            right: 2rem;
            font-size: 5rem;
            color: #333;
            cursor: pointer;
            border: none;
            background: none;
          }
        `}
      </style>
    </>
  );
}
