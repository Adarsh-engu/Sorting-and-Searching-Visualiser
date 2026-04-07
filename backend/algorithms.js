// Helper to record a frame
const record = (steps, array, activeIndices, type, message) => {
    steps.push({
        arrayState: [...array],
        activeIndices: [...activeIndices],
        type,
        message
    });
};

const algorithms = {
    // --- SEARCHING ALGORITHMS ---

    linearSearch: (initialArray, target) => {
        const steps = [];
        const arr = [...initialArray];
        record(steps, arr, [], "SEARCH", "Starting Linear Search");

        for (let i = 0; i < arr.length; i++) {
            record(steps, arr, [i], "SEARCH", `Checking index ${i} (Value: ${arr[i]})`);
            if (arr[i] === target) {
                record(steps, arr, [i], "SEARCH", `Target ${target} found at index ${i}!`);
                return steps;
            }
        }
        record(steps, arr, [], "SEARCH", `Target ${target} not found.`);
        return steps;
    },

    binarySearch: (initialArray, target) => {
        const steps = [];
        const arr = [...initialArray].sort((a, b) => a - b);
        record(steps, arr, [], "SEARCH", "Array sorted for Binary Search");

        let left = 0, right = arr.length - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            record(steps, arr, [left, mid, right], "SEARCH", `Checking bounds [L:${left}, R:${right}]. Mid is ${mid}`);

            if (arr[mid] === target) {
                record(steps, arr, [mid], "SEARCH", `Target ${target} found at index ${mid}!`);
                return steps;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        record(steps, arr, [], "SEARCH", `Target ${target} not found.`);
        return steps;
    },

    // --- SORTING ALGORITHMS ---

    bubbleSort: (initialArray) => {
        const steps = [];
        const arr = [...initialArray];
        let n = arr.length;
        let swapped;

        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                record(steps, arr, [i, i + 1], "SORT", `Comparing ${arr[i]} and ${arr[i + 1]}`);
                if (arr[i] > arr[i + 1]) {
                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                    record(steps, arr, [i, i + 1], "SORT", `Swapped ${arr[i + 1]} and ${arr[i]}`);
                }
            }
            n--; // Optimization: last element is strictly sorted
        } while (swapped);

        record(steps, arr, [], "SORT", "Bubble Sort Complete!");
        return steps;
    },

    selectionSort: (initialArray) => {
        const steps = [];
        const arr = [...initialArray];

        for (let i = 0; i < arr.length - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                record(steps, arr, [minIdx, j], "SORT", `Finding minimum... comparing ${arr[minIdx]} with ${arr[j]}`);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                let temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
                record(steps, arr, [i, minIdx], "SORT", `Swapped minimum (${arr[i]}) into position ${i}`);
            }
        }
        record(steps, arr, [], "SORT", "Selection Sort Complete!");
        return steps;
    },

    insertionSort: (initialArray) => {
        const steps = [];
        const arr = [...initialArray];

        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            record(steps, arr, [i], "SORT", `Selecting ${key} to insert into sorted portion`);

            while (j >= 0 && arr[j] > key) {
                record(steps, arr, [j, j + 1], "SORT", `Moving ${arr[j]} to the right`);
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
            record(steps, arr, [j + 1], "SORT", `Inserted ${key} at index ${j + 1}`);
        }
        record(steps, arr, [], "SORT", "Insertion Sort Complete!");
        return steps;
    },

    quickSort: (initialArray) => {
        const steps = [];
        const arr = [...initialArray];

        const partition = (low, high) => {
            let pivot = arr[high];
            let i = low - 1;
            for (let j = low; j < high; j++) {
                record(steps, arr, [j, high], "SORT", `Comparing ${arr[j]} to pivot ${pivot}`);
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    record(steps, arr, [i, j], "SORT", `Swapped smaller element to the left`);
                }
            }
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            record(steps, arr, [i + 1, high], "SORT", `Positioned pivot ${pivot} correctly`);
            return i + 1;
        };

        const sort = (low, high) => {
            if (low < high) {
                let pi = partition(low, high);
                sort(low, pi - 1);
                sort(pi + 1, high);
            }
        };

        sort(0, arr.length - 1);
        record(steps, arr, [], "SORT", "Quick Sort Complete!");
        return steps;
    },

    mergeSort: (initialArray) => {
        const steps = [];
        const arr = [...initialArray];

        const merge = (left, mid, right) => {
            let n1 = mid - left + 1;
            let n2 = right - mid;
            let L = new Array(n1), R = new Array(n2);

            for (let i = 0; i < n1; i++) L[i] = arr[left + i];
            for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

            let i = 0, j = 0, k = left;
            while (i < n1 && j < n2) {
                record(steps, arr, [left + i, mid + 1 + j], "SORT", `Comparing sub-arrays`);
                if (L[i] <= R[j]) {
                    arr[k] = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    j++;
                }
                record(steps, arr, [k], "SORT", `Overwriting index ${k} with merged value ${arr[k]}`);
                k++;
            }
            while (i < n1) {
                arr[k] = L[i];
                record(steps, arr, [k], "SORT", `Merging remaining left element ${arr[k]}`);
                i++; k++;
            }
            while (j < n2) {
                arr[k] = R[j];
                record(steps, arr, [k], "SORT", `Merging remaining right element ${arr[k]}`);
                j++; k++;
            }
        };

        const sort = (left, right) => {
            if (left < right) {
                let mid = Math.floor(left + (right - left) / 2);
                sort(left, mid);
                sort(mid + 1, right);
                merge(left, mid, right);
            }
        };

        sort(0, arr.length - 1);
        record(steps, arr, [], "SORT", "Merge Sort Complete!");
        return steps;
    },

    radixSort: (initialArray) => {
        const steps = [];
        const arr = [...initialArray];

        const getMax = () => {
            let max = arr[0];
            for (let i = 1; i < arr.length; i++) if (arr[i] > max) max = arr[i];
            return max;
        };

        const countSort = (exp) => {
            let output = new Array(arr.length).fill(0);
            let count = new Array(10).fill(0);

            for (let i = 0; i < arr.length; i++) count[Math.floor(arr[i] / exp) % 10]++;
            for (let i = 1; i < 10; i++) count[i] += count[i - 1];
            
            for (let i = arr.length - 1; i >= 0; i--) {
                let digit = Math.floor(arr[i] / exp) % 10;
                output[count[digit] - 1] = arr[i];
                count[digit]--;
            }

            for (let i = 0; i < arr.length; i++) {
                arr[i] = output[i];
                record(steps, arr, [i], "SORT", `Rebuilding array based on ${exp}s place`);
            }
        };

        let max = getMax();
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            record(steps, arr, [], "SORT", `Sorting by digit: ${exp}s place`);
            countSort(exp);
        }

        record(steps, arr, [], "SORT", "Radix Sort Complete!");
        return steps;
    }
};

module.exports = algorithms;