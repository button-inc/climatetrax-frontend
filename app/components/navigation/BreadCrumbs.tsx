"use client";
import { useTranslation } from "@/i18n/client";
import { CrumbItems } from "@/types/declarations";

const Breadcrumbs = ({ items }: CrumbItems) => {
  // 👇️ language management
  const { t } = useTranslation("translation");
  // 👇️ translations
  items.forEach((item) => {
    item.title = t(item.title);
  });
  return (
    <>
      <div className="flex gap-2 items-start">
        {items &&
          items.map((crumb, i) => {
            const isLastItem = i === items.length - 1;
            return (
              <a
                key={i}
                href={crumb.href}
                className={`${
                  isLastItem ? "" : "hover:text-purple-800 hover:underline"
                }`}
              >
                {crumb.title}
                {!isLastItem && <span> / </span>}
              </a>
            );
          })}
      </div>
    </>
  );
};
export default Breadcrumbs;
