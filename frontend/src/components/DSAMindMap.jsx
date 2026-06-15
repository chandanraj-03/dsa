import React, { useRef, useEffect, useState, useContext } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Maximize, ZoomIn, ZoomOut, RotateCcw, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const markdownContent = `
# 🎯 DSA Master Roadmap

## 🟦 Linear Data Structures
### 📊 Arrays
- Two Pointers Pattern
- Sliding Window
- Prefix Sums
- Kadane's Algorithm
- Dutch National Flag

### 🔤 Strings
- Pattern Matching
- Anagram & Frequency Maps
- Palindrome Validation
- KMP Algorithm

### 🗺️ Hash Maps
- Frequency Counting
- Two Sum Variations
- Grouping & Bucketing
- LRU Cache Design

### 📚 Stacks
- Monotonic Stack
- Valid Parentheses
- Next Greater Element
- Min Stack Implementation

### 🚶 Queues
- BFS Traversal
- Sliding Window Maximum
- Circular Queue

## 🟩 Linked Structures
### 🔗 Linked Lists
- Fast & Slow Pointers
- Reverse a Linked List
- Merge Sorted Lists
- Detect & Remove Cycle

## 🌳 Trees & Graphs
### 🌲 Binary Trees
- Inorder / Preorder / Postorder
- Level Order Traversal (BFS)
- Binary Search Tree (BST)
- Lowest Common Ancestor
- Diameter of a Tree

### 🕸️ Graphs
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Topological Sorting
- Dijkstra's Algorithm
- Union Find / Disjoint Set
- Shortest Path Problems

## 🔁 Recursion & Backtracking
### 🪆 Recursion
- Base Case Design
- Tree Recursion
- Divide & Conquer

### 🔙 Backtracking
- N-Queens Problem
- Permutations & Combinations
- Subset Generation
- Sudoku Solver

## 🏔️ Advanced DS
### ⛰️ Heaps / Priority Queues
- Min Heap / Max Heap
- K-th Largest Element
- Top K Frequent Elements
- Merge K Sorted Lists

### 🗂️ Tries
- Insert & Search Operations
- Autocomplete
- Word Search II

## 🧮 Algorithms
### 🧩 Dynamic Programming
- 1D DP — Climbing Stairs
- 2D DP — Grid Problems
- Knapsack Variants
- LCS & LIS

### 🏃 Greedy
- Activity Selection
- Huffman Coding
- Jump Game

### 🔢 Bit Manipulation
- XOR Tricks
- Bit Masking

### 🗃️ Sorting
- Merge Sort
- Quick Sort
- Heap Sort

### 🔍 Binary Search
- Search in Rotated Array
- Koko Eating Bananas
- Median of Two Arrays

### 📏 Range Queries
- Segment Tree
- Fenwick Tree (BIT)

## 🏁 Final Sprint
### 🎓 Revision Strategy
- Full Topic Revision
- Mock Interviews
- System Design Basics
`;

// Vibrant depth-based color palettes
const DEPTH_COLORS_DARK = [
  '#a78bfa', // root — violet
  '#60a5fa', // depth 1 — blue
  '#34d399', // depth 2 — emerald
  '#fbbf24', // depth 3 — amber
  '#f472b6', // depth 4 — pink
  '#38bdf8', // depth 5 — sky
  '#a3e635', // depth 6 — lime
];

const DEPTH_COLORS_LIGHT = [
  '#7c3aed', // root — violet
  '#2563eb', // depth 1 — blue  
  '#059669', // depth 2 — emerald
  '#d97706', // depth 3 — amber
  '#db2777', // depth 4 — pink
  '#0284c7', // depth 5 — sky
  '#65a30d', // depth 6 — lime
];

// Generate the <style> CSS that gets injected into the document
function generateMarkmapCSS(isDark) {
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const textShadow = isDark ? '0 1px 3px rgba(0,0,0,0.8)' : 'none';
  const circleFill = isDark ? '#1e293b' : '#ffffff';
  const circleStrokeWidth = '2.5px';
  const linkOpacity = isDark ? '0.5' : '0.4';

  return `
    /* ─── Markmap Global Overrides ─── */
    .markmap-node text {
      fill: ${textColor} !important;
      font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      text-shadow: ${textShadow} !important;
      dominant-baseline: central !important;
    }

    /* Root node — make it pop */
    .markmap-node[data-depth="0"] text {
      font-size: 18px !important;
      font-weight: 700 !important;
      fill: ${isDark ? '#e2e8f0' : '#0f172a'} !important;
    }

    /* Depth 1 nodes (categories) */
    .markmap-node[data-depth="1"] text {
      font-size: 15px !important;
      font-weight: 600 !important;
    }

    /* Depth 2 nodes (subcategories) */
    .markmap-node[data-depth="2"] text {
      font-size: 13px !important;
      font-weight: 600 !important;
    }

    /* Depth 3+ nodes (leaf items) */
    .markmap-node[data-depth="3"] text,
    .markmap-node[data-depth="4"] text {
      font-size: 12px !important;
      font-weight: 400 !important;
      fill: ${isDark ? '#cbd5e1' : '#475569'} !important;
    }

    .markmap-node circle {
      fill: ${circleFill} !important;
      stroke-width: ${circleStrokeWidth} !important;
      r: 5 !important;
      transition: r 0.2s ease, fill 0.2s ease !important;
    }

    .markmap-node:hover circle {
      r: 7 !important;
      fill: ${isDark ? '#334155' : '#f1f5f9'} !important;
    }

    .markmap-link {
      fill: none !important;
      opacity: ${linkOpacity} !important;
      transition: opacity 0.2s ease !important;
    }

    .markmap-link:hover {
      opacity: 0.9 !important;
    }

    /* Foreign object overrides for wrapped content */
    .markmap-foreign {
      display: inline-block !important;
    }
  `;
}

const transformer = new Transformer();

export default function DSAMindMap() {
  const svgRef = useRef(null);
  const mmRef = useRef(null);
  const styleRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDark = theme === 'dark';

  // Inject / update global CSS for markmap styling
  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      styleRef.current.id = 'markmap-custom-styles';
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = generateMarkmapCSS(isDark);

    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [isDark]);

  // Create / recreate the markmap when theme changes
  useEffect(() => {
    if (!svgRef.current) return;

    const { root } = transformer.transform(markdownContent);
    svgRef.current.innerHTML = '';

    const colors = isDark ? DEPTH_COLORS_DARK : DEPTH_COLORS_LIGHT;

    const mm = Markmap.create(svgRef.current, {
      autoFit: true,
      spacingHorizontal: 140,
      spacingVertical: 12,
      paddingX: 24,
      maxWidth: 280,
      initialExpandLevel: 2,
      duration: 400,
      color: (node) => {
        const depth = node.state?.depth ?? 0;
        return colors[depth % colors.length];
      },
      lineWidth: (node) => {
        const depth = node.state?.depth ?? 0;
        return Math.max(1.5, 4 - depth * 0.5);
      },
    }, root);

    mmRef.current = mm;

    // Slight delay to let the layout settle, then fit
    setTimeout(() => {
      mm.fit();
    }, 300);

    return () => {
      if (svgRef.current) {
        svgRef.current.innerHTML = '';
      }
    };
  }, [isDark]);

  const handleFit = () => mmRef.current?.fit();
  
  const handleZoomIn = () => {
    if (!mmRef.current) return;
    mmRef.current.rescale(1.4);
  };

  const handleZoomOut = () => {
    if (!mmRef.current) return;
    mmRef.current.rescale(0.7);
  };

  const handleExpandAll = () => {
    if (!mmRef.current) return;
    // Walk the tree and expand all nodes
    const walkAndExpand = (node) => {
      if (node.payload) node.payload.fold = 0;
      if (node.children) node.children.forEach(walkAndExpand);
    };
    walkAndExpand(mmRef.current.state.data);
    mmRef.current.renderData();
    setIsCollapsed(false);
    setTimeout(() => mmRef.current?.fit(), 300);
  };

  const handleCollapseToLevel2 = () => {
    if (!mmRef.current) return;
    const walkAndCollapse = (node, depth = 0) => {
      if (depth >= 2 && node.children?.length) {
        if (!node.payload) node.payload = {};
        node.payload.fold = 1;
      }
      if (node.children) node.children.forEach(c => walkAndCollapse(c, depth + 1));
    };
    walkAndCollapse(mmRef.current.state.data);
    mmRef.current.renderData();
    setIsCollapsed(true);
    setTimeout(() => mmRef.current?.fit(), 300);
  };

  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-slate-900/50 via-dark-900/80 to-slate-900/50'
    : 'bg-gradient-to-br from-slate-50/80 via-white/50 to-slate-100/80';

  return (
    <div className="w-full h-[700px] glass-panel overflow-hidden flex flex-col relative group shadow-2xl border-primary-500/20">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-violet-600/8' : 'bg-violet-400/10'}`} />
        <div className={`absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-blue-600/8' : 'bg-blue-400/10'}`} />
        <div className={`absolute top-1/2 left-1/3 w-48 h-48 rounded-full blur-3xl ${isDark ? 'bg-emerald-600/5' : 'bg-emerald-400/8'}`} />
      </div>

      {/* Floating Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Hint badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg shadow-lg border border-slate-200/80 dark:border-slate-700/80 pointer-events-none mr-1">
          <Navigation size={12} className="text-primary-500" />
          <span>Drag to pan · Scroll to zoom · Click nodes to expand</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
          <button 
            onClick={handleZoomIn}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border-r border-slate-200/80 dark:border-slate-700/80"
            title="Zoom in"
          >
            <ZoomIn size={15} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border-r border-slate-200/80 dark:border-slate-700/80"
            title="Zoom out"
          >
            <ZoomOut size={15} />
          </button>
          <button 
            onClick={handleFit}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border-r border-slate-200/80 dark:border-slate-700/80"
            title="Fit to screen"
          >
            <Maximize size={15} />
          </button>
          <button 
            onClick={isCollapsed ? handleExpandAll : handleCollapseToLevel2}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title={isCollapsed ? 'Expand all' : 'Collapse branches'}
          >
            {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>
      </div>

      {/* Color Legend */}
      <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-200/80 dark:border-slate-700/80">
          {[
            { label: 'Linear DS', color: isDark ? DEPTH_COLORS_DARK[1] : DEPTH_COLORS_LIGHT[1] },
            { label: 'Trees/Graphs', color: isDark ? DEPTH_COLORS_DARK[2] : DEPTH_COLORS_LIGHT[2] },
            { label: 'Recursion', color: isDark ? DEPTH_COLORS_DARK[3] : DEPTH_COLORS_LIGHT[3] },
            { label: 'Advanced', color: isDark ? DEPTH_COLORS_DARK[4] : DEPTH_COLORS_LIGHT[4] },
            { label: 'Algorithms', color: isDark ? DEPTH_COLORS_DARK[5] : DEPTH_COLORS_LIGHT[5] },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <svg 
        ref={svgRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing ${bgGradient} transition-colors duration-300`}
        style={{ pointerEvents: 'all' }} 
      />
    </div>
  );
}
