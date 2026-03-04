import { useEffect } from "react";
import { updatePageSEO, addStructuredData } from "../utils/seo";

export const useSEO = (pageName, structuredData = null) => {
  useEffect(() => {
    updatePageSEO(pageName);
    if (structuredData) {
      addStructuredData(structuredData);
    }
  }, [pageName, structuredData]);
};
