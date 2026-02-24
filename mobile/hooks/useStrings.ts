import { Strings } from "@/constants/Strings";
import { useState } from "react";

export function useStrings() {
  const [locale] = useState<keyof typeof Strings>("kk");

  return Strings[locale];
}
