import React from "react";
import { registerUIComponent } from "../engine";
import { of } from "rxjs";
import { buildWorld } from "../../loupe/loupe";

export function registerTestButton() {
  registerUIComponent(
    "TestButton",
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
      return (
        <button onClick={() => {buildWorld(world)}}></button>
      );
    }
  );
}
