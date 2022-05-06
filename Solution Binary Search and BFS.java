
import java.util.LinkedList;
import java.util.Queue;

public class Solution {

    private static final int LAND = 0;
    private static final int WATER = 1;
    private static final int[][] MOVES = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    private static record Point(int row, int column) {}
    private int rows;
    private int columns;
    private int[][] matrix;

    public int latestDayToCross(int rows, int columns, int[][] pointsToFlood) {
        this.rows = rows;
        this.columns = columns;
        return findMaxDaysToWait(pointsToFlood);
    }

    private int findMaxDaysToWait(int[][] pointsToFlood) {
        int lowerLimit = 0;
        int upperLimit = rows * columns;
        int maxDaysToWait = 0;

        while (lowerLimit <= upperLimit) {
            int time = lowerLimit + (upperLimit - lowerLimit) / 2;
            if (goalCanBeReached(pointsToFlood, time)) {
                maxDaysToWait = Math.max(maxDaysToWait, time);
                lowerLimit = time + 1;
            } else {
                upperLimit = time - 1;
            }
        }
        return maxDaysToWait;
    }

    private boolean goalCanBeReached(int[][] pointsToFlood, int time) {
        matrix = new int[rows][columns];
        initiallyFloodMatrixForGivenTime(pointsToFlood, time);

        Queue<Point> queuePerson = new LinkedList<>();
        boolean[][] visited = new boolean[rows][columns];
        initializePersonDataForCurrentSearch(queuePerson, visited);

        while (!queuePerson.isEmpty()) {

            int size = queuePerson.size();
            while (size-- > 0) {
                Point point = queuePerson.poll();
                if (point.row == rows - 1 && matrix[point.row][point.column] == LAND) {
                    return true;
                }
                for (int[] move : MOVES) {
                    int nextRow = point.row + move[0];
                    int nextColumn = point.column + move[1];
                    if (isInMatrix(nextRow, nextColumn) && matrix[nextRow][nextColumn] == LAND && !visited[nextRow][nextColumn]) {
                        visited[nextRow][nextColumn] = true;
                        queuePerson.add(new Point(nextRow, nextColumn));
                    }
                }
            }
        }
        return false;
    }

    private void initializePersonDataForCurrentSearch(Queue<Point> queuePerson, boolean[][] visited) {
        for (int c = 0; c < columns; ++c) {
            if (matrix[0][c] == LAND) {
                queuePerson.add(new Point(0, c));
                visited[0][c] = true;
            }
        }
    }

    private void initiallyFloodMatrixForGivenTime(int[][] pointsToFlood, int time) {
        for (int i = 0; i < time; ++i) {
            int rowToFlood = pointsToFlood[i][0] - 1;
            int columnToFlood = pointsToFlood[i][1] - 1;
            matrix[rowToFlood][columnToFlood] = WATER;
        }
    }

    private boolean isInMatrix(int row, int column) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
}
