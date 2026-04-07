import { useState, useEffect } from 'react';
import './App.css';
import { motion } from 'framer-motion';
// Educational Metadata for Better Explanations
const ALGO_INFO = {
  bubbleSort: { name: "Bubble Sort", time: "O(n²)", space: "O(1)", desc: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Largest elements 'bubble' to the top." },
  selectionSort: { name: "Selection Sort", time: "O(n²)", space: "O(1)", desc: "Divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum element from the unsorted part and puts it at the beginning." },
  insertionSort: { name: "Insertion Sort", time: "O(n²)", space: "O(1)", desc: "Builds the final sorted array one item at a time. It takes each element from the unsorted list and inserts it into its correct position in the sorted list." },
  quickSort: { name: "Quick Sort", time: "O(n log n)", space: "O(log n)", desc: "A divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot." },
  mergeSort: { name: "Merge Sort", time: "O(n log n)", space: "O(n)", desc: "A divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves." },
  radixSort: { name: "Radix Sort", time: "O(nk)", space: "O(n + k)", desc: "A non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix (base/digit)." },
  linearSearch: { name: "Linear Search", time: "O(n)", space: "O(1)", desc: "Sequentially checks each element of the list until a match is found or the whole list has been searched." },
  binarySearch: { name: "Binary Search", time: "O(log n)", space: "O(1)", desc: "Searches a sorted array by repeatedly dividing the search interval in half. Requires the array to be sorted first." }
};

function App() {
  const [algoType, setAlgoType] = useState('bubbleSort'); 
  const [arrayInput, setArrayInput] = useState("45, 12, 78, 34, 89, 5000, 56, 1, 99, 67");
  const [targetInput, setTargetInput] = useState(56);
  
  const [steps, setSteps] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Ready to visualize. Press Generate & Play.");
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(600);

  const isSearchAlgo = algoType === 'binarySearch' || algoType === 'linearSearch';
  const currentInfo = ALGO_INFO[algoType];

  useEffect(() => {
    if (steps.length === 0 || isPaused || currentStepIndex >= steps.length - 1) return;
    const timer = setTimeout(() => setCurrentStepIndex((prev) => prev + 1), speed);
    return () => clearTimeout(timer); 
  }, [steps, currentStepIndex, isPaused, speed]);

  const fetchAlgorithmSteps = async () => {
    setStatusMessage("Calculating...");
    const arrayData = arrayInput.split(',').map(num => parseInt(num.trim(), 10));
    
    try {
      const response = await fetch('http://localhost:3000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            algorithm: algoType, 
            array: arrayData, 
            target: isSearchAlgo ? Number(targetInput) : null 
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setStatusMessage("Error: " + data.error);
        return;
      }
      
      setSteps(data);
      setCurrentStepIndex(0);
      setIsPaused(false);
    } catch (error) {
      setStatusMessage("Failed to connect to backend. Is Node running?");
    }
  };

  const currentFrame = steps[currentStepIndex];
  const maxValue = currentFrame ? Math.max(...currentFrame.arrayState, 1) : 1;
  const maxContainerHeight = 350; 

  return (
    <div className="app-container">
      
      {/* HEADER SECTION */}
      <header className="app-header">
        <h1>Algorithm Visualizer</h1>
        <p className="subtitle">Interactive Computer Science Educational Tool</p>
      </header>
      
      <div className="main-layout">
        
        {/* LEFT COLUMN: CONTROLS & INFO */}
        <div className="sidebar">
          <div className="glass-card controls-card">
            <h3>Configuration</h3>
            <div className="input-group">
                <label>Select Algorithm:</label>
                <select value={algoType} onChange={(e) => { setAlgoType(e.target.value); setSteps([]); setStatusMessage("Ready to visualize."); }} className="custom-input">
                    <optgroup label="Sorting">
                        <option value="bubbleSort">Bubble Sort</option>
                        <option value="selectionSort">Selection Sort</option>
                        <option value="insertionSort">Insertion Sort</option>
                        <option value="quickSort">Quick Sort</option>
                        <option value="mergeSort">Merge Sort</option>
                        <option value="radixSort">Radix Sort</option>
                    </optgroup>
                    <optgroup label="Searching">
                        <option value="linearSearch">Linear Search</option>
                        <option value="binarySearch">Binary Search</option>
                    </optgroup>
                </select>
            </div>

            <div className="input-group">
              <label>Array Data (comma separated):</label>
              <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="custom-input"/>
            </div>
            
            {isSearchAlgo && (
                <div className="input-group">
                <label>Search Target:</label>
                <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="custom-input" />
                </div>
            )}

            <div className="input-group">
                <label>Animation Speed: </label>
                <input type="range" min="50" max="1500" step="50" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} dir="rtl" className="speed-slider"/>
            </div>

            <div className="button-group">
              <button onClick={fetchAlgorithmSteps} className="btn primary-btn">Generate & Play</button>
              <button onClick={() => setIsPaused(!isPaused)} disabled={steps.length === 0} className="btn secondary-btn">
                {isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          </div>

          {/* NEW: ALGORITHM INFO CARD */}
          <div className="glass-card info-card">
             <h3>{currentInfo.name}</h3>
             <p className="desc-text">{currentInfo.desc}</p>
             <div className="complexity-badges">
                <span className="badge time-badge">Time: {currentInfo.time}</span>
                <span className="badge space-badge">Space: {currentInfo.space}</span>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUALIZATION */}
        <div className="visualization-area">
            
            {/* DYNAMIC ACTION MESSAGE */}
            <div className="glass-card status-card">
                <h2>{currentFrame ? currentFrame.message : statusMessage}</h2>
                {steps.length > 0 && (
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
                    </div>
                )}
            </div>

            {/* CANVAS */}
            {/* CANVAS */}
            <div className="glass-card canvas">
                {currentFrame && (() => {
                    
                    // --- THE FIX: Unique Key Generation ---
                    // We create a dictionary to track how many times a number appears in THIS frame
                    const occurrences = {};
                    
                    return (
                        <div className="array-container" style={{ alignItems: currentFrame.type === 'SORT' ? 'flex-end' : 'center', minHeight: '380px' }}>
                            
                            {currentFrame.arrayState.map((value, index) => {
                                // Increment the count for this specific number
                                occurrences[value] = (occurrences[value] || 0) + 1;
                                
                                // Create a composite key (e.g., "5000-1", "5000-2")
                                const uniqueKey = `${value}-${occurrences[value]}`;

                                const isActive = currentFrame.activeIndices.includes(index);
                                const barHeight = Math.max((value / maxValue) * maxContainerHeight, 25);

                                return (
                                    <motion.div 
                                        layout
                                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                        key={uniqueKey}  /* <-- Replaced {value} with our new safe key */
                                        className={`array-box ${isActive ? 'active' : ''} ${currentFrame.type === 'SEARCH' ? 'search-box' : ''}`} 
                                        style={currentFrame.type === 'SORT' ? { height: `${barHeight}px` } : {}}
                                    >
                                        <span className="value-label">{value}</span>
                                    </motion.div>
                                );
                            })}
                            
                        </div>
                    );
                })()}
            </div>
        </div>

      </div>
    </div>
  );
}

export default App;