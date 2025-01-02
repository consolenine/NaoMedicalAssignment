"use client"
import React, { Dispatch, SetStateAction, useEffect } from "react";

import { createListCollection } from "@chakra-ui/react"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select"

interface LanguageSelectProps {
  language: string[];
  setLanguage: Dispatch<SetStateAction<string[]>>;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ language, setLanguage }) => {
  const languages = createListCollection({
    items: [
      { label: "English (US)", value: "en-US" },
      { label: "English (India)", value: "en-IN" },
      { label: "Hindi", value: "hi-IN" }
    ],
  })

  useEffect(() => {
    if (!language) {
      setLanguage([languages.items[0].value])
    }
  }, []);

  return (
    <SelectRoot
      collection={languages}
      size="lg"
      width="320px"
      onValueChange={(e) => setLanguage(e.value)}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select language" p={2} />
      </SelectTrigger>
      <SelectContent>
        {languages.items.map((lang) => (
          <SelectItem item={lang} key={lang.value} color={"white"} p={2}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

export default LanguageSelect;