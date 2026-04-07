# Algorithm Execution Visualizer

A full-stack, interactive visualization tool designed to demonstrate the internal mechanics of core computer science algorithms. Built with a decoupled architecture, the logic engine pre-computes algorithmic states on a Node.js backend, while a React front-end renders the execution frames using physics-based layout animations.

## Features

- **Algorithmic Coverage:** Supports Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Radix Sort, Linear Search, and Binary Search.
- **Smooth Layout Animations:** Uses framer-motion to handle complex DOM element tracking and swaps, preventing standard React reconciliation bugs during array mutations (e.g., duplicate keys during Insertion Sort overwrites).
- **Dynamic Data Scaling:** Automatically normalizes bar heights relative to the maximum integer in the user-provided dataset to maintain viewport integrity.
- **Execution Control:** Custom data injection, dynamic speed controls, and pause/resume functionality.
- **Complexity Context:** Real-time Big-O notation updates and algorithmic context based on the active selection.

## Architecture

This project avoids the common pitfall of attempting to block the main browser thread with while loops or setInterval hacks. Instead, it utilizes a **State Snapshot Architecture**:
1. The React client posts a raw array to the Express API.
2. The Node.js engine executes the algorithm start-to-finish, capturing a deep clone of the array state, active indices, and descriptive context at every critical operation.
3. The payload of "frames" is returned to the client.
4. React maps over the frames via an asynchronous useEffect hook, acting purely as a non-blocking video player.

## Tech Stack

- **Client:** React, Vite, Framer Motion, CSS3 (Glassmorphism UI)
- **Server:** Node.js, Express.js

## Local Setup

**1. Clone the repository:**
git clone https://github.com/Adarsh-engu/Sorting-and-Searching-Visualiser.git
cd Sorting-and-Searching-Visualiser

**2. Start the backend:**
cd backend
npm install
node server.js

**3. Start the frontend:**
cd frontend
npm install
npm run dev
