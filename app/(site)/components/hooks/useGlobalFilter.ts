import { Dispatch, SetStateAction, useState } from "react";

export default function useGlobalFilter(): [string, Dispatch<SetStateAction<string>>] {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  return [globalFilter, setGlobalFilter];
}
