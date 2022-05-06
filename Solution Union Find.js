
/**
 * @param {number} rows
 * @param {number} columns
 * @param {number[][]} pointsToFlood
 * @return {number}
 */
var latestDayToCross = function (rows, columns, pointsToFlood) {
    this.LAND = 0;
    this.WATER = 1;
    this.ADJACENT_WATER_POINTS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, 1], [-1, -1], [1, -1]];

    this.rows = rows;
    this.columns = columns;
    this.matrix = Array.from(new Array(rows), () => new Array(this.columns).fill(0));
    return findMaxDaysToWait(pointsToFlood);
};

/**
 * @param {number[][]} pointsToFlood
 * @return {number}
 */
function findMaxDaysToWait(pointsToFlood) {
    const unionFind = new UnionFind(this.rows, this.columns);
    let maxDaysToWait = 0;

    for (let point of pointsToFlood) {
        let row = point[0] - 1;
        let column = point[1] - 1;
        this.matrix[row][column] = this.WATER;

        for (let neighbour of this.ADJACENT_WATER_POINTS) {
            let nextRow = row + neighbour[0];
            let nextColumn = column + neighbour[1];

            if (isInMatrix(nextRow, nextColumn) && matrix[nextRow][nextColumn] === this.WATER) {
                let parentPrevious = unionFind.findParent(row * this.columns + column);
                let parentNext = unionFind.findParent(nextRow * this.columns + nextColumn);
                unionFind.joinByRank(parentPrevious, parentNext);
            }
        }

        let parentLeftmostSide = unionFind.findParent(unionFind.dammyValueLeftmostSide);
        let parentRightmostSide = unionFind.findParent(unionFind.dammyValueRightmostSide);
        if (parentLeftmostSide === parentRightmostSide) {
            break;
        }
        ++maxDaysToWait;
    }
    return maxDaysToWait;
}

/**
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function isInMatrix(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}

class UnionFind {

    /**
     * @param {number} rows
     * @param {number} columns
     */
    constructor(rows, columns) {
        this.dammyValueLeftmostSide = rows * columns;
        this.dammyValueRightmostSide = rows * columns + 1;

        //(rows * columns + 2) to take account of the two dummy values.
        this.parent = Array.from(Array(rows * columns + 2).keys());
        this.rank = new Array(rows * columns + 2);
        this.joinCornerColumnsToDummyValues(rows, columns);
    }

    /**
     * @param {number} rows
     * @param {number} columns
     * @return {void}
     */
    joinCornerColumnsToDummyValues(rows, columns) {
        for (let r = 0; r < rows; ++r) {
            this.parent[r * columns] = this.dammyValueLeftmostSide;
            this.parent[columns * (r + 1) - 1] = this.dammyValueRightmostSide;
        }
    }

    /**
     * @param {number} index
     * @return {number}
     */
    findParent(index) {
        if (this.parent[index] !== index) {
            this.parent[index] = this.findParent(this.parent[index]);
        }
        return this.parent[index];
    }

    /**
     * @param {number} first
     * @param {number} second
     * @return {void}
     */
    joinByRank(first, second) {
        if (this.rank[first] > this.rank[second]) {
            this.parent[second] = first;
        } else if (this.rank[first] < this.rank[second]) {
            this.parent[first] = second;
        } else {
            this.parent[second] = first;
            ++this.rank[first];
        }
    }
}
