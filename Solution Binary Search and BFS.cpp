
#include <iterator>
#include <vector>
#include <array>
using namespace std;

class Solution {

    struct Point {
        size_t row;
        size_t column;
        Point(size_t row, size_t column) : row {row}, column {column}{}
        Point() = default;
        ~Point() = default;
    };

    inline static const int LAND = 0;
    inline static const int WATER = 1;
    inline static const array<array<int8_t, 2>, 4> MOVES{ {{-1, 0}, {1, 0}, {0, -1}, {0, 1}} };

    size_t rows;
    size_t columns;
    vector<vector<int>> matrix;

public:
    int latestDayToCross(int rows, int columns, const vector<vector<int>>& pointsToFlood) {
        this->rows = rows;
        this->columns = columns;
        return findMaxDaysToWait(pointsToFlood);
    }

private:
    int findMaxDaysToWait(const vector<vector<int>>& pointsToFlood) {
        int lowerLimit = 0;
        int upperLimit = rows * columns;
        int maxDaysToWait = 0;

        while (lowerLimit <= upperLimit) {
            int time = lowerLimit + (upperLimit - lowerLimit) / 2;
            if (goalCanBeReached(pointsToFlood, time)) {
                maxDaysToWait = max(maxDaysToWait, time);
                lowerLimit = time + 1;
            } else {
                upperLimit = time - 1;
            }
        }
        return maxDaysToWait;
    }

    bool goalCanBeReached(const vector<vector<int>>& pointsToFlood, int time) {
        matrix.assign(rows, vector<int>(columns));
        initiallyFloodMatrixForGivenTime(pointsToFlood, time);

        queue<Point> queuePerson;
        vector < vector<bool>> visited(rows, vector<bool>(columns));
        initializePersonDataForCurrentSearch(queuePerson, visited);

        while (!queuePerson.empty()) {

            int size = queuePerson.size();
            while (size-- > 0) {
                Point point = queuePerson.front();
                queuePerson.pop();
                if (point.row == rows - 1 && matrix[point.row][point.column] == LAND) {
                    return true;
                }
                for (const auto& move : MOVES) {
                    int nextRow = point.row + move[0];
                    int nextColumn = point.column + move[1];
                    if (isInMatrix(nextRow, nextColumn) && matrix[nextRow][nextColumn] == LAND && !visited[nextRow][nextColumn]) {
                        visited[nextRow][nextColumn] = true;
                        queuePerson.push(Point(nextRow, nextColumn));
                    }
                }
            }
        }
        return false;
    }

    void initializePersonDataForCurrentSearch(queue<Point>& queuePerson, vector<vector<bool>>& visited) {
        for (int c = 0; c < columns; ++c) {
            if (matrix[0][c] == LAND) {
                queuePerson.push(Point(0, c));
                visited[0][c] = true;
            }
        }
    }

    void initiallyFloodMatrixForGivenTime(const vector<vector<int>>& pointsToFlood, int time) {
        for (int i = 0; i < time; ++i) {
            int rowToFlood = pointsToFlood[i][0] - 1;
            int columnToFlood = pointsToFlood[i][1] - 1;
            matrix[rowToFlood][columnToFlood] = WATER;
        }
    }

    bool isInMatrix(int row, int column) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
};
