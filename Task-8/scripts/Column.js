export class Column {

    /**
     * 
     * @param {number} index - Column index.
     * @param {number} width - Width of the column.
     */

    constructor(index, width) {

        /** @type {number} */
        this.columnIndex = index;

        /** @type {number} */
        this.width = width;
    }

    columnName(index) {
        let name = "";

        while (index >= 0) {
            name = String.fromCharCode((index % 26) + 65) + name;
            index = Math.floor(index / 26) - 1;
        }

        return name;
    }

}