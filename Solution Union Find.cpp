
#include <iterator>
#include <vector>
#include <array>
using namespace std;

class UnionFind {
    
public:
    int dammyValueLeftmostSide;
    int dammyValueRightmostSide;
    vector<int> parent;
    vector<int> rank;

    UnionFind(int rows, int columns) {
        dammyValueLeftmostSide = rows * columns;
        dammyValueRightmostSide = rows * columns + 1;

        //(rows * columns + 2) to take account of the two dummy values.
        parent.resize(rows * columns + 2);
        iota(parent.begin(), parent.end(), 0);
        rank.resize(rows * columns + 2);
        joinCornerColumnsToDummyValues(rows, columns);
    }

    void joinCornerColumnsToDummyValues(int rows, int columns) {
        for (int r = 0; r < rows; ++r) {
            parent[r * columns] = dammyValueLeftmostSide;
            parent[columns * (r + 1) - 1] = dammyValueRightmostSide;
        }
    }

    int findParent(int index) {
        if (parent[index] != index) {
            parent[index] = findParent(parent[index]);
        }
        return parent[index];
    }

    void joinByRank(int first, int second) {
        if (rank[first] > rank[second]) {
            parent[second] = first;
        } else if (rank[first] < rank[second]) {
            parent[first] = second;
        } else {
            parent[second] = first;
            ++rank[first];
        }
    }
};

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
    inline static const array<array<int8_t, 2>, 8> ADJACENT_WATER_POINTS
    { {{-1, 0}, {1, 0}, {0, -1}, {0, 1}, {-1, 1}, {1, 1}, {-1, -1}, {1, -1}} };

    size_t rows;
    size_t columns;
    vector<vector<int>> matrix;

public:
    int latestDayToCross(int rows, int columns, const vector<vector<int>>& pointsToFlood) {
        this->rows = rows;
        this->columns = columns;
        matrix.assign(rows, vector<int>(columns));
        return findMaxDaysToWait(pointsToFlood);
    }

private:
    int findMaxDaysToWait(const vector<vector<int>>& pointsToFlood) {
        UnionFind unionFind(rows, columns);
        int maxDaysToWait = 0;

        for (const auto& point : pointsToFlood) {
            int row = point[0] - 1;
            int column = point[1] - 1;
            matrix[row][column] = WATER;

            for (const auto& neighbour : ADJACENT_WATER_POINTS) {
                int nextRow = row + neighbour[0];
                int nextColumn = column + neighbour[1];

                if (isInMatrix(nextRow, nextColumn) && matrix[nextRow][nextColumn] == WATER) {
                    int parentPrevious = unionFind.findParent(row * columns + column);
                    int parentNext = unionFind.findParent(nextRow * columns + nextColumn);
                    unionFind.joinByRank(parentPrevious, parentNext);
                }
            }

            int parentLeftmostSide = unionFind.findParent(unionFind.dammyValueLeftmostSide);
            int parentRightmostSide = unionFind.findParent(unionFind.dammyValueRightmostSide);
            if (parentLeftmostSide == parentRightmostSide) {
                break;
            }
            ++maxDaysToWait;
        }
        return maxDaysToWait;
    }

    bool isInMatrix(int row, int column) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
};
