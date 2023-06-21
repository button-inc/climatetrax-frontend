"use client";
import { useState } from "react";
import { useTranslation } from "@/i18n/client";

export default function Page() {
  // 👇️ language management
  let { t } = useTranslation("translation");

  const [connection, setConnection] = useState("");
  const [type, setType] = useState("");
  const [project, setProject] = useState("");
  const [keyPath, setKeyPath] = useState("");
  const [keyJson, setKeyJson] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    console.log("Connection:", connection);
    console.log("Type:", type);
    console.log("Project:", project);
    console.log("Key Path:", keyPath);
    console.log("Key JSON:", keyJson);
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="connection"
            >
              {t("dataset.connection.add.fields.connection")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="connection"
              type="text"
              value={connection}
              onChange={(e) => setConnection(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="type"
            >
              {t("dataset.connection.add.fields.type")}
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option
                value={
                  t("dataset.connection.add.fields.options.type.values.0") || ""
                }
              >
                {t("dataset.connection.add.fields.options.type.texts.0")}
              </option>
              <option
                value={
                  t("dataset.connection.add.fields.options.type.values.1") ||
                  "1"
                }
              >
                {t("dataset.connection.add.fields.options.type.texts.1")}
              </option>
              <option
                value={
                  t("dataset.connection.add.fields.options.type.values.2") ||
                  "2"
                }
              >
                {t("dataset.connection.add.fields.options.type.texts.2")}
              </option>
              <option
                value={
                  t("dataset.connection.add.fields.options.type.values.3") ||
                  "3"
                }
              >
                {t("dataset.connection.add.fields.options.type.texts.3")}
              </option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="project"
            >
              {t("dataset.connection.add.fields.project")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="project"
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="keypath"
            >
              {t("dataset.connection.add.fields.keypath")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="keypath"
              type="text"
              value={keyPath}
              onChange={(e) => setKeyPath(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="keyjson"
            >
              {t("dataset.connection.add.fields.keyjson")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="keyjson"
              type="text"
              value={keyJson}
              onChange={(e) => setKeyJson(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {t("dataset.connection.add.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
