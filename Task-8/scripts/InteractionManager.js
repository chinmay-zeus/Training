import { ColumnResizer } from "./ColumnResizer.js";
import { RowResizer } from "./RowResizer.js";

export class InteractionManager {
    constructor(canvas, container, handlers) {
        this.canvas = canvas;
        this.container = container;
        this.handlers = handlers; // array of Handler instances
        this.activeHandler = null;

        canvas.addEventListener("pointerdown", this._onMouseDown.bind(this));
        window.addEventListener("pointermove", this._onMouseMove.bind(this));
        window.addEventListener("pointerup", this._onMouseUp.bind(this));
        // canvas.addEventListener("pointermove", this._detectHover.bind(this));
    }

    _detectHover(e) {
        const pointer = this._getPointer(e);
        for (const handler of this.handlers) {
            if (!this.activeHandler && handler.hitTest(pointer, e, mode)) {
                this.activeHandler = handler;
                return;
            }
        }
    }

    _onMouseDown(e) {
        const pointer = this._getPointer(e);
        for (const handler of this.handlers) {
            if (handler.hitTest(pointer, e, 'activate')) {
                this.activeHandler = handler;
                handler.onMouseDown(e, pointer);
                break;
            }
        }
    }

    _onMouseMove(e) {
        const pointer = this._getPointer(e);

        if (this.activeHandler) {
            this.activeHandler.onMouseMove(e, pointer);
        } else {
            for (const handler of this.handlers) {
                if (handler.hitTest(pointer, e, 'hover')) {
                    if (handler instanceof ColumnResizer) {
                        this.canvas.style.cursor = handler.hoverCursor || 'e-resize';
                    }

                    if (handler instanceof RowResizer) {
                        this.canvas.style.cursor = handler.hoverCursor || 'n-resize';
                    }
                    return;
                }
            }
            this.activeHandler = null;
            this.canvas.style.cursor = 'cell';
        }
    }

    _onMouseUp(e) {
        if (this.activeHandler) {
            const pointer = this._getPointer(e);
            this.activeHandler.onMouseUp(e, pointer);
            this.activeHandler = null;
        }
    }

    _getPointer(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left + this.container.scrollLeft,
            y: e.clientY - rect.top + this.container.scrollTop
        };
    }
}
