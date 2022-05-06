
/**
 * @param {number} rows
 * @param {number} columns
 * @param {number[][]} pointsToFlood
 * @return {number}
 */
var latestDayToCross = function (rows, columns, pointsToFlood) {
    this.LAND = 0;
    this.WATER = 1;
    this.MOVES = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    this.rows = rows;
    this.columns = columns;
    this.matrix = [];
    return findMaxDaysToWait(pointsToFlood);
};

/**
 * @param {number[][]} pointsToFlood
 * @return {number}
 */
function findMaxDaysToWait(pointsToFlood) {
    let lowerLimit = 0;
    let upperLimit = this.rows * this.columns;
    let maxDaysToWait = 0;

    while (lowerLimit <= upperLimit) {
        let time = lowerLimit + Math.floor((upperLimit - lowerLimit) / 2);
        if (goalCanBeReached(pointsToFlood, time)) {
            maxDaysToWait = Math.max(maxDaysToWait, time);
            lowerLimit = time + 1;
        } else {
            upperLimit = time - 1;
        }
    }
    return maxDaysToWait;
}

/**
 * @param {number[][]} pointsToFlood
 * @param {number} time
 * @return {boolean}
 */
function goalCanBeReached(pointsToFlood, time) {
    this.matrix = Array.from(new Array(rows), () => new Array(this.columns).fill(0));
    initiallyFloodMatrixForGivenTime(pointsToFlood, time);

    const queuePerson = new Queue();
    const visited = Array.from(new Array(rows), () => new Array(this.columns).fill(false));
    initializePersonDataForCurrentSearch(queuePerson, visited);

    while (!queuePerson.isEmpty()) {

        let size = queuePerson.size();
        while (size-- > 0) {
            const point = queuePerson.dequeue();
            if (point.row === this.rows - 1 && this.matrix[point.row][point.column] === this.LAND) {
                return true;
            }
            for (let move of this.MOVES) {
                let nextRow = point.row + move[0];
                let nextColumn = point.column + move[1];
                if (isInMatrix(nextRow, nextColumn) && matrix[nextRow][nextColumn] === this.LAND && !visited[nextRow][nextColumn]) {
                    visited[nextRow][nextColumn] = true;
                    queuePerson.enqueue(new Point(nextRow, nextColumn));
                }
            }
        }
    }
    return false;
}

/**
 * @param {Queue of Point Objects} queuePerson
 * @param {number} visited
 * @return {void}
 */
function initializePersonDataForCurrentSearch(queuePerson, visited) {
    for (let c = 0; c < this.columns; ++c) {
        if (this.matrix[0][c] === this.LAND) {
            queuePerson.enqueue(new Point(0, c));
            visited[0][c] = true;
        }
    }
}

/**
 * @param {number[][]} pointsToFlood
 * @param {number} time
 * @return {void}
 */
function initiallyFloodMatrixForGivenTime(pointsToFlood, time) {
    for (let i = 0; i < time; ++i) {
        let rowToFlood = pointsToFlood[i][0] - 1;
        let columnToFlood = pointsToFlood[i][1] - 1;
        this.matrix[rowToFlood][columnToFlood] = this.WATER;
    }
}

/**
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function isInMatrix(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}

/**
 * @param {number} row
 * @param {number} column
 */
function Point(row, column) {
    this.row = row;
    this.column = column;
}
