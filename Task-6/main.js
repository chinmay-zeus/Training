import { Background } from "./Background.js";
import { BackgroundContainer } from "./BackgroundContainer.js";
import { Box } from "./Box.js";

const backgroundContainer = new BackgroundContainer()
const background = new Background(backgroundContainer);
const draggable = new Box(background);
    // window.addEventListener("resize", (e) => draggable.updateBounds(e));
