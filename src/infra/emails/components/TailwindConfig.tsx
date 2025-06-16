import { Tailwind } from "@react-email/tailwind";
import React from "react";

interface TailwindConfigProps {
  children: React.ReactNode;
}

export function TailwindConfig({ children }: TailwindConfigProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              foodiary: {
                green: "#64A30D",
              },
              gray: {
                600: '#A1A1AA'
              }
            },
          },
        },
      }}
    >
      {children}
    </Tailwind>
  );
}
