export class InteractionManager {
    constructor(canvas, container, handlers) {
        this.canvas = canvas;
        this.container = container;
        this.handlers = handlers; // array of Handler instances
        this.activeHandler = null;

        canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
        window.addEventListener("mousemove", this._onMouseMove.bind(this));
        window.addEventListener("mouseup", this._onMouseUp.bind(this));
        canvas.addEventListener("mousemove", this._detectHover.bind(this));
    }

    _detectHover(e) {
        const pointer = this._getPointer(e);
        for (const handler of this.handlers) {
            if ( handler.hitTest(pointer, e)) {
                this.activeHandler = handler;
                return;
            }
        }
    }

    _onMouseDown(e) {
        const pointer = this._getPointer(e);
        for (const handler of this.handlers) {
            if (handler.hitTest(pointer, e)) {
                this.activeHandler = handler;
                handler.onMouseDown(e, pointer);
                break;
            }
        }
    }

    _onMouseMove(e) {
        if (this.activeHandler) {
            const pointer = this._getPointer(e);
            this.activeHandler.onMouseMove(e, pointer);
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
