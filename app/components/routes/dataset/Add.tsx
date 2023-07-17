"use client";
import { useTranslation } from "@/i18n/client";
import { crumbsDatasetAdd } from "@/utils/navigation/crumbs";
import { GraphqlEndPoint } from "@/types/declarations";
import { useSession } from "next-auth/react";
import { useState } from "react";

import dynamic from "next/dynamic";
//👇️ will not be rendered on the server, prevents error: Text content did not match. Server
const Tag = dynamic(() => import("@/components/layout/Tag"), {
  ssr: false,
});
export default function Page({ endpoint }: GraphqlEndPoint) {
  // 👇️ language management
  const { t } = useTranslation("translation");
  // 👇️ useSession hook from the next-auth/react library
  const { data: session } = useSession();
  // 👇️ screen masking management
  const [isMasked, setIsMasked] = useState(false);
  // 👇️ success message management
  const [successMessage, setSuccessMessage] = useState("");
  // 👇️ error message management
  const [errorMessage, setErrorMessage] = useState("");

  // 👇️ handler for click: request a new connection
  const handleClickRequest = () => {
    const emailTo = t("dataset.add.emailTo");
    const emailSubject = t("dataset.add.emailSubject");
    const emailBody = t("dataset.add.emailBody");
    window.open(
      "mailto:" + emailTo + "?subject=" + emailSubject + "&body=" + emailBody,
      "_blank"
    );
  };

  // 👇️ handler for click: Add dataset tiles
  const handleClickInputFile = () => {
    // 👇️ clear messages
    setSuccessMessage("");
    setErrorMessage("");
    // 👇️ display select file prompt
    const inputFile = document.getElementById("inputfile");
    if (inputFile) {
      inputFile.click();
    }
  };

  // 👇️ handler for file input change
  const handleChangeInputFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      // 👇️ mask the screen
      setIsMasked(true);
      // 👇️ add file upload to formdata
      const file = event.target.files[0];
      const formData = new FormData();
      const sessionUserName = session?.user?.name ?? "";
      formData.append("uploadedFile", file);
      formData.append("userName", sessionUserName);
      // 👇️ post formdata to api
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        // 👇️ display response message
        if (response.ok) {
          const successMessage = t("messages.successes.upload");
          setSuccessMessage(successMessage);
        } else {
          {
            let errorMessage = "";
            const message = await response.text();
            if (message === "unsupported") {
              // 👇️ display file type error message
              errorMessage = t("messages.errors.upload.unsupported");
            } else {
              // 👇️ display generic error message
              errorMessage = t("messages.errors.upload.generic");
            }

            setErrorMessage(errorMessage);
          }
        }
        // Return the response or any relevant data
        return response;
      } catch (error: any) {
        setErrorMessage(`An error occurred while uploading: ${error.message}`);
      } finally {
        // 👇️ unmask screen
        setIsMasked(false);
        // 👇️ clear the file input value
        event.target.value = "";
      }
    } else {
      // 👇️ unmask screen
      setIsMasked(false);
    }
  };
  return (
    <>
      {/* Mask overlay */}
      {isMasked && (
        <div className="--is-masked fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50" />
      )}
      <Tag tag={"dataset.add.tag"} crumbs={crumbsDatasetAdd}></Tag>
      {/* Tiles */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card cursor-pointer" onClick={handleClickRequest}>
          <div className="top1">
            <img
              alt={t("dataset.add.request") || ""}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAJ1BMVEX///8AAABZWVn4+Pi/v7+zs7OioqLp6emZmZlra2tdXV2oqKgeHh5SHkywAAABeUlEQVR4nO3dS66CQBRFURGUn/Mf78uLkZa2rEpxyrUGYO6OAcrGxcsFAAAAAAAAAPhR47RPY+sharoN/26tx6jnPjzdWw9Syzy8zK1HqWQ5CpfWo1SyHoVr61EquR6F19ajVKIwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvP1X7gdhVvrUd6Yl/X6pe1xFD62bz9sXQrvEt+H8ym6EX5rXfNWwb3+sXXLB+XezjC1TvlgKla4t075YC9W2P932P912P+99Aeehz9wpini3OfSEvr/baEwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvMpzKcwn8J8CvP1X9j/f6svR+HSepRK5qPwjDu8Rbw2wgtvYZ/Jc6+/6B792YzTPhV8EwIAAAAAAAAAkOUPN2oQMjDsn+EAAAAASUVORK5CYII="
            />
          </div>
          <div className="bottom">
            <p>{t("dataset.add.request")}</p>
          </div>
        </div>
        <div
          data-myFileInput="1"
          className="card"
          onClick={() => handleClickInputFile()}
        >
          <div className="top">
            <img
              alt={t("dataset.add.file") || ""}
              src="data:image/png;base64,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"
            />
          </div>
          <div className="bottom">
            <p>{t("dataset.add.file")}</p>
          </div>
        </div>
      </div>
      {/* render the success message if it exists */}
      {successMessage && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
          role="alert"
        >
          <p className="font-bold">{t("messages.successes.label")}</p>
          <p>{successMessage}</p>
        </div>
      )}
      {/* render the error message if it exists */}
      {errorMessage && (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
          role="alert"
        >
          <p className="font-bold">{t("messages.errors.label")}</p>
          <p>{errorMessage}</p>
        </div>
      )}
      {/* hidden file input, triggered from handleClickInputFile */}
      <input
        type="file"
        id="inputfile"
        accept=".json, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv, .xml"
        style={{ display: "none" }}
        onChange={handleChangeInputFile}
      />
      <style jsx>
        {`
          .cards {
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          .card {
            background: #fff;
            border-radius: 3px;
            display: inline-block;
            height: 300px;
            margin: 1rem;
            position: relative;
            width: 290px;
            overflow: hidden;
          }

          .card .top,
          .card .top1 {
            display: inline-flex;
            width: 100%;
            height: 220px;
            overflow: hidden;
            justify-content: center;
          }

          .card .top img {
            height: 220px;
          }
          .card .top1 img {
            margin-top: 60px;
          }

          .card .bottom {
            min-height: 80px;
            width: 100%;
          }

          .card .bottom p {
            text-align: center;
            height: 80px;
            width: 100%;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            padding-left: 20px;
            display: flex;
            align-items: center;
            text-decoration: none;
            color: #444;
            font-size: 18px;
            font-weight: 900;
          }

          .card {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
              0 1px 2px rgba(0, 0, 0, 0.24);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .card:hover {
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
              0 10px 10px rgba(0, 0, 0, 0.22);
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
