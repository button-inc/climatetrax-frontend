"use client";
import { useTranslation } from "@/i18n/client";
import BreadCrumbs from "@/components/navigation/BreadCrumbs";
import { TagProps } from "@/types/declarations";

export default function Tag({
  tag,
  crumbs = [],
}: TagProps): React.ReactElement {
  // 👇️ language management
  const { t } = useTranslation("translation");
  return (
    <>
      <h4 className="text-3xl font-normal leading-normal mt-0 mb-2 text-purple-800">
        {t(tag)}
      </h4>
      <BreadCrumbs items={crumbs} />
    </>
  );
}
