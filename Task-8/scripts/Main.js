import { Grid } from "./Grid.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const container = document.querySelector(".container");

const TOTAL_ROWS = 100;
const TOTAL_COLS = 20;
const CELL_WIDTH = 64;
const CELL_HEIGHT = 20;
const HEADER_WIDTH = 80;
const HEADER_HEIGHT = 35;
const SCALE = window.devicePixelRatio || 1;

const grid = new Grid(canvas, ctx, TOTAL_ROWS, TOTAL_COLS, CELL_WIDTH, CELL_HEIGHT, HEADER_HEIGHT, HEADER_WIDTH, SCALE);

container.addEventListener("scroll", () => {
  const scrollLeft = container.scrollLeft;
  const scrollTop = container.scrollTop;
  grid.render(scrollLeft, scrollTop, container.clientWidth, container.clientHeight);
});

grid.render(0, 0, container.clientWidth, container.clientHeight);
