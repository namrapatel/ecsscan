import React from "react";
import { Browser } from "@latticexyz/ecs-browser";
import { registerUIComponent } from "../engine";
import { of } from "rxjs";

export function registerPlaceHolder() {
  registerUIComponent(
    "Placeholder",
    {
      colStart: 10,
      colEnd: 13,
      rowStart: 1,
      rowEnd: 13,
    },
    (layers) => of({ layers }),
    ({ layers }) => {
      const {
        network: { world, dev },
      } = layers;
      return <p style={{ color: "black" }}>Hello from placeholder</p>;
    }
  );
}
