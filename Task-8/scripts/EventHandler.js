// EventDispatcher.js
export class EventHandler {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {HTMLElement} container
     * @param {Array<Object>} tools - modules with onMouseDown, onMouseMove etc.
     */
    constructor(canvas, container, tools = []) {
        this.canvas = canvas;
        this.container = container;
        this.tools = tools;

        canvas.addEventListener("mousedown", e => this._dispatch('onMouseDown', e));
        window.addEventListener("mousemove", e => this._dispatch('onMouseMove', e));
        window.addEventListener("mouseup", e => this._dispatch('onMouseUp', e));
        container.addEventListener("scroll", e => this._dispatch('onScroll', e));
        window.addEventListener("resize", e => this._dispatch('onResize', e));
    }

    _dispatch(method, event) {
        for (const tool of this.tools) {
            if (typeof tool[method] === "function") {
                const handled = tool[method](event);
                if (handled) break;
            }
        }
    }
}
