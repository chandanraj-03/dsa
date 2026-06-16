import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "placementprep")

# ============================================================================
# PHASE 1: FOUNDATIONS (Week 1-2)
# ============================================================================

phase1_arrays = [
    # Patterns: Traversal, Prefix Sum, Difference Array, Kadane's, Two Pointers, Sliding Window
    # Algorithms: Kadane's, Prefix Sum, Dutch National Flag, Boyer-Moore Voting
    (1, "Two Sum", "Easy", "https://leetcode.com/problems/two-sum/"),
    (121, "Best Time to Buy and Sell Stock", "Easy", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"),
    (53, "Maximum Subarray", "Medium", "https://leetcode.com/problems/maximum-subarray/"),
    (238, "Product of Array Except Self", "Medium", "https://leetcode.com/problems/product-of-array-except-self/"),
    (75, "Sort Colors (Dutch National Flag)", "Medium", "https://leetcode.com/problems/sort-colors/"),
    (169, "Majority Element (Boyer-Moore)", "Easy", "https://leetcode.com/problems/majority-element/"),
    (303, "Range Sum Query - Immutable (Prefix Sum)", "Easy", "https://leetcode.com/problems/range-sum-query-immutable/"),
    (560, "Subarray Sum Equals K", "Medium", "https://leetcode.com/problems/subarray-sum-equals-k/"),
    (11, "Container With Most Water", "Medium", "https://leetcode.com/problems/container-with-most-water/"),
    (15, "3Sum", "Medium", "https://leetcode.com/problems/3sum/"),
    (42, "Trapping Rain Water", "Hard", "https://leetcode.com/problems/trapping-rain-water/"),
    (209, "Minimum Size Subarray Sum", "Medium", "https://leetcode.com/problems/minimum-size-subarray-sum/"),
    (283, "Move Zeroes", "Easy", "https://leetcode.com/problems/move-zeroes/"),
    (26, "Remove Duplicates from Sorted Array", "Easy", "https://leetcode.com/problems/remove-duplicates-from-sorted-array/"),
    (724, "Find Pivot Index (Prefix Sum)", "Easy", "https://leetcode.com/problems/find-pivot-index/"),
]

phase1_strings = [
    # Patterns: Two Pointers, Sliding Window, Pattern Matching
    # Algorithms: KMP, Rabin-Karp
    (125, "Valid Palindrome", "Easy", "https://leetcode.com/problems/valid-palindrome/"),
    (3, "Longest Substring Without Repeating Characters", "Medium", "https://leetcode.com/problems/longest-substring-without-repeating-characters/"),
    (76, "Minimum Window Substring", "Hard", "https://leetcode.com/problems/minimum-window-substring/"),
    (424, "Longest Repeating Character Replacement", "Medium", "https://leetcode.com/problems/longest-repeating-character-replacement/"),
    (567, "Permutation in String", "Medium", "https://leetcode.com/problems/permutation-in-string/"),
    (14, "Longest Common Prefix", "Easy", "https://leetcode.com/problems/longest-common-prefix/"),
    (28, "Find the Index of the First Occurrence (KMP)", "Easy", "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/"),
    (8, "String to Integer (atoi)", "Medium", "https://leetcode.com/problems/string-to-integer-atoi/"),
    (6, "Zigzag Conversion", "Medium", "https://leetcode.com/problems/zigzag-conversion/"),
    (151, "Reverse Words in a String", "Medium", "https://leetcode.com/problems/reverse-words-in-a-string/"),
    (344, "Reverse String", "Easy", "https://leetcode.com/problems/reverse-string/"),
    (242, "Valid Anagram", "Easy", "https://leetcode.com/problems/valid-anagram/"),
    (387, "First Unique Character in a String", "Easy", "https://leetcode.com/problems/first-unique-character-in-a-string/"),
    (680, "Valid Palindrome II", "Easy", "https://leetcode.com/problems/valid-palindrome-ii/"),
    (49, "Group Anagrams", "Medium", "https://leetcode.com/problems/group-anagrams/"),
]

phase1_hashing = [
    # Patterns: Frequency Counting, Lookup Optimization, Index Mapping
    (1, "Two Sum", "Easy", "https://leetcode.com/problems/two-sum/"),
    (49, "Group Anagrams", "Medium", "https://leetcode.com/problems/group-anagrams/"),
    (347, "Top K Frequent Elements", "Medium", "https://leetcode.com/problems/top-k-frequent-elements/"),
    (217, "Contains Duplicate", "Easy", "https://leetcode.com/problems/contains-duplicate/"),
    (128, "Longest Consecutive Sequence", "Medium", "https://leetcode.com/problems/longest-consecutive-sequence/"),
    (383, "Ransom Note", "Easy", "https://leetcode.com/problems/ransom-note/"),
    (205, "Isomorphic Strings", "Easy", "https://leetcode.com/problems/isomorphic-strings/"),
    (290, "Word Pattern", "Easy", "https://leetcode.com/problems/word-pattern/"),
    (380, "Insert Delete GetRandom O(1)", "Medium", "https://leetcode.com/problems/insert-delete-getrandom-o1/"),
    (36, "Valid Sudoku", "Medium", "https://leetcode.com/problems/valid-sudoku/"),
    (560, "Subarray Sum Equals K", "Medium", "https://leetcode.com/problems/subarray-sum-equals-k/"),
    (974, "Subarray Sums Divisible by K", "Medium", "https://leetcode.com/problems/subarray-sums-divisible-by-k/"),
    (692, "Top K Frequent Words", "Medium", "https://leetcode.com/problems/top-k-frequent-words/"),
    (451, "Sort Characters By Frequency", "Medium", "https://leetcode.com/problems/sort-characters-by-frequency/"),
    (438, "Find All Anagrams in a String", "Medium", "https://leetcode.com/problems/find-all-anagrams-in-a-string/"),
]

# ============================================================================
# PHASE 2: LINEAR DATA STRUCTURES (Week 3)
# ============================================================================

phase2_linked_list = [
    # Patterns: Fast & Slow Pointer, Reversal, Merge Lists
    # Algorithms: Floyd Cycle Detection
    (206, "Reverse Linked List", "Easy", "https://leetcode.com/problems/reverse-linked-list/"),
    (141, "Linked List Cycle (Floyd's)", "Easy", "https://leetcode.com/problems/linked-list-cycle/"),
    (21, "Merge Two Sorted Lists", "Easy", "https://leetcode.com/problems/merge-two-sorted-lists/"),
    (142, "Linked List Cycle II", "Medium", "https://leetcode.com/problems/linked-list-cycle-ii/"),
    (876, "Middle of the Linked List", "Easy", "https://leetcode.com/problems/middle-of-the-linked-list/"),
    (234, "Palindrome Linked List", "Easy", "https://leetcode.com/problems/palindrome-linked-list/"),
    (143, "Reorder List", "Medium", "https://leetcode.com/problems/reorder-list/"),
    (19, "Remove Nth Node From End of List", "Medium", "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"),
    (138, "Copy List with Random Pointer", "Medium", "https://leetcode.com/problems/copy-list-with-random-pointer/"),
    (2, "Add Two Numbers", "Medium", "https://leetcode.com/problems/add-two-numbers/"),
    (25, "Reverse Nodes in k-Group", "Hard", "https://leetcode.com/problems/reverse-nodes-in-k-group/"),
    (23, "Merge k Sorted Lists", "Hard", "https://leetcode.com/problems/merge-k-sorted-lists/"),
    (287, "Find the Duplicate Number", "Medium", "https://leetcode.com/problems/find-the-duplicate-number/"),
    (160, "Intersection of Two Linked Lists", "Easy", "https://leetcode.com/problems/intersection-of-two-linked-lists/"),
    (148, "Sort List", "Medium", "https://leetcode.com/problems/sort-list/"),
]

phase2_stack = [
    # Patterns: Monotonic Stack, Next Greater Element, Expression Evaluation
    # Algorithms: Shunting Yard (optional)
    (20, "Valid Parentheses", "Easy", "https://leetcode.com/problems/valid-parentheses/"),
    (739, "Daily Temperatures", "Medium", "https://leetcode.com/problems/daily-temperatures/"),
    (84, "Largest Rectangle in Histogram", "Hard", "https://leetcode.com/problems/largest-rectangle-in-histogram/"),
    (155, "Min Stack", "Medium", "https://leetcode.com/problems/min-stack/"),
    (150, "Evaluate Reverse Polish Notation", "Medium", "https://leetcode.com/problems/evaluate-reverse-polish-notation/"),
    (496, "Next Greater Element I", "Easy", "https://leetcode.com/problems/next-greater-element-i/"),
    (503, "Next Greater Element II", "Medium", "https://leetcode.com/problems/next-greater-element-ii/"),
    (901, "Online Stock Span", "Medium", "https://leetcode.com/problems/online-stock-span/"),
    (394, "Decode String", "Medium", "https://leetcode.com/problems/decode-string/"),
    (735, "Asteroid Collision", "Medium", "https://leetcode.com/problems/asteroid-collision/"),
    (402, "Remove K Digits", "Medium", "https://leetcode.com/problems/remove-k-digits/"),
    (316, "Remove Duplicate Letters", "Medium", "https://leetcode.com/problems/remove-duplicate-letters/"),
    (224, "Basic Calculator", "Hard", "https://leetcode.com/problems/basic-calculator/"),
    (227, "Basic Calculator II", "Medium", "https://leetcode.com/problems/basic-calculator-ii/"),
    (22, "Generate Parentheses", "Medium", "https://leetcode.com/problems/generate-parentheses/"),
]

phase2_queue_deque = [
    # Patterns: BFS-style processing, Monotonic Queue
    (239, "Sliding Window Maximum", "Hard", "https://leetcode.com/problems/sliding-window-maximum/"),
    (225, "Implement Stack using Queues", "Easy", "https://leetcode.com/problems/implement-stack-using-queues/"),
    (232, "Implement Queue using Stacks", "Easy", "https://leetcode.com/problems/implement-queue-using-stacks/"),
    (622, "Design Circular Queue", "Medium", "https://leetcode.com/problems/design-circular-queue/"),
    (641, "Design Circular Deque", "Medium", "https://leetcode.com/problems/design-circular-deque/"),
    (862, "Shortest Subarray with Sum at Least K", "Hard", "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/"),
    (346, "Moving Average from Data Stream", "Easy", "https://leetcode.com/problems/moving-average-from-data-stream/"),
    (933, "Number of Recent Calls", "Easy", "https://leetcode.com/problems/number-of-recent-calls/"),
    (950, "Reveal Cards In Increasing Order", "Medium", "https://leetcode.com/problems/reveal-cards-in-increasing-order/"),
    (1438, "Longest Continuous Subarray With Abs Diff <= Limit", "Medium", "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/"),
    (649, "Dota2 Senate", "Medium", "https://leetcode.com/problems/dota2-senate/"),
    (1696, "Jump Game VI", "Medium", "https://leetcode.com/problems/jump-game-vi/"),
    (995, "Minimum Number of K Consecutive Bit Flips", "Hard", "https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/"),
    (387, "First Unique Character in a String", "Easy", "https://leetcode.com/problems/first-unique-character-in-a-string/"),
    (621, "Task Scheduler", "Medium", "https://leetcode.com/problems/task-scheduler/"),
]

# ============================================================================
# PHASE 3: RECURSION & BACKTRACKING (Week 4)
# ============================================================================

phase3_backtracking = [
    # Patterns: Decision Tree, Choose / Explore / Unchoose
    # Algorithms: Backtracking
    (78, "Subsets", "Medium", "https://leetcode.com/problems/subsets/"),
    (46, "Permutations", "Medium", "https://leetcode.com/problems/permutations/"),
    (39, "Combination Sum", "Medium", "https://leetcode.com/problems/combination-sum/"),
    (51, "N-Queens", "Hard", "https://leetcode.com/problems/n-queens/"),
    (90, "Subsets II", "Medium", "https://leetcode.com/problems/subsets-ii/"),
    (47, "Permutations II", "Medium", "https://leetcode.com/problems/permutations-ii/"),
    (40, "Combination Sum II", "Medium", "https://leetcode.com/problems/combination-sum-ii/"),
    (79, "Word Search", "Medium", "https://leetcode.com/problems/word-search/"),
    (131, "Palindrome Partitioning", "Medium", "https://leetcode.com/problems/palindrome-partitioning/"),
    (17, "Letter Combinations of a Phone Number", "Medium", "https://leetcode.com/problems/letter-combinations-of-a-phone-number/"),
    (77, "Combinations", "Medium", "https://leetcode.com/problems/combinations/"),
    (216, "Combination Sum III", "Medium", "https://leetcode.com/problems/combination-sum-iii/"),
    (93, "Restore IP Addresses", "Medium", "https://leetcode.com/problems/restore-ip-addresses/"),
    (37, "Sudoku Solver", "Hard", "https://leetcode.com/problems/sudoku-solver/"),
    (52, "N-Queens II", "Hard", "https://leetcode.com/problems/n-queens-ii/"),
]

# ============================================================================
# PHASE 4: TREES (Week 5)
# ============================================================================

phase4_binary_trees = [
    # Patterns: DFS, BFS, Path-based
    # Algorithms: Preorder, Inorder, Postorder, Level Order
    (104, "Maximum Depth of Binary Tree", "Easy", "https://leetcode.com/problems/maximum-depth-of-binary-tree/"),
    (543, "Diameter of Binary Tree", "Easy", "https://leetcode.com/problems/diameter-of-binary-tree/"),
    (112, "Path Sum", "Easy", "https://leetcode.com/problems/path-sum/"),
    (236, "Lowest Common Ancestor of a Binary Tree", "Medium", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"),
    (226, "Invert Binary Tree", "Easy", "https://leetcode.com/problems/invert-binary-tree/"),
    (100, "Same Tree", "Easy", "https://leetcode.com/problems/same-tree/"),
    (572, "Subtree of Another Tree", "Easy", "https://leetcode.com/problems/subtree-of-another-tree/"),
    (102, "Binary Tree Level Order Traversal", "Medium", "https://leetcode.com/problems/binary-tree-level-order-traversal/"),
    (199, "Binary Tree Right Side View", "Medium", "https://leetcode.com/problems/binary-tree-right-side-view/"),
    (105, "Construct Tree from Preorder and Inorder", "Medium", "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"),
    (124, "Binary Tree Maximum Path Sum", "Hard", "https://leetcode.com/problems/binary-tree-maximum-path-sum/"),
    (297, "Serialize and Deserialize Binary Tree", "Hard", "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"),
    (110, "Balanced Binary Tree", "Easy", "https://leetcode.com/problems/balanced-binary-tree/"),
    (1448, "Count Good Nodes in Binary Tree", "Medium", "https://leetcode.com/problems/count-good-nodes-in-binary-tree/"),
    (113, "Path Sum II", "Medium", "https://leetcode.com/problems/path-sum-ii/"),
]

phase4_bst = [
    # Algorithms: Search, Insert, Delete
    (98, "Validate Binary Search Tree", "Medium", "https://leetcode.com/problems/validate-binary-search-tree/"),
    (230, "Kth Smallest Element in a BST", "Medium", "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"),
    (235, "LCA of a BST", "Medium", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"),
    (108, "Convert Sorted Array to BST", "Easy", "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/"),
    (701, "Insert into a BST", "Medium", "https://leetcode.com/problems/insert-into-a-binary-search-tree/"),
    (450, "Delete Node in a BST", "Medium", "https://leetcode.com/problems/delete-node-in-a-bst/"),
    (700, "Search in a BST", "Easy", "https://leetcode.com/problems/search-in-a-binary-search-tree/"),
    (783, "Minimum Distance Between BST Nodes", "Easy", "https://leetcode.com/problems/minimum-distance-between-bst-nodes/"),
    (530, "Minimum Absolute Difference in BST", "Easy", "https://leetcode.com/problems/minimum-absolute-difference-in-bst/"),
    (173, "BST Iterator", "Medium", "https://leetcode.com/problems/binary-search-tree-iterator/"),
    (669, "Trim a BST", "Medium", "https://leetcode.com/problems/trim-a-binary-search-tree/"),
    (538, "Convert BST to Greater Tree", "Medium", "https://leetcode.com/problems/convert-bst-to-greater-tree/"),
    (501, "Find Mode in BST", "Easy", "https://leetcode.com/problems/find-mode-in-binary-search-tree/"),
    (653, "Two Sum IV - Input is a BST", "Easy", "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/"),
    (897, "Increasing Order Search Tree", "Easy", "https://leetcode.com/problems/increasing-order-search-tree/"),
]

# ============================================================================
# PHASE 5: HEAP & PRIORITY QUEUE (Week 6)
# ============================================================================

phase5_heap = [
    # Patterns: Top K, K-way Merge
    # Algorithms: Heapify, Min Heap, Max Heap
    (215, "Kth Largest Element in an Array", "Medium", "https://leetcode.com/problems/kth-largest-element-in-an-array/"),
    (347, "Top K Frequent Elements", "Medium", "https://leetcode.com/problems/top-k-frequent-elements/"),
    (23, "Merge k Sorted Lists", "Hard", "https://leetcode.com/problems/merge-k-sorted-lists/"),
    (703, "Kth Largest Element in a Stream", "Easy", "https://leetcode.com/problems/kth-largest-element-in-a-stream/"),
    (1046, "Last Stone Weight", "Easy", "https://leetcode.com/problems/last-stone-weight/"),
    (973, "K Closest Points to Origin", "Medium", "https://leetcode.com/problems/k-closest-points-to-origin/"),
    (295, "Find Median from Data Stream", "Hard", "https://leetcode.com/problems/find-median-from-data-stream/"),
    (621, "Task Scheduler", "Medium", "https://leetcode.com/problems/task-scheduler/"),
    (355, "Design Twitter", "Medium", "https://leetcode.com/problems/design-twitter/"),
    (692, "Top K Frequent Words", "Medium", "https://leetcode.com/problems/top-k-frequent-words/"),
    (378, "Kth Smallest Element in Sorted Matrix", "Medium", "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/"),
    (373, "Find K Pairs with Smallest Sums", "Medium", "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/"),
    (767, "Reorganize String", "Medium", "https://leetcode.com/problems/reorganize-string/"),
    (480, "Sliding Window Median", "Hard", "https://leetcode.com/problems/sliding-window-median/"),
    (632, "Smallest Range Covering Elements from K Lists", "Hard", "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/"),
]

# ============================================================================
# PHASE 6: GRAPHS (Week 7)
# ============================================================================

phase6_graph_traversal = [
    # Patterns: BFS, DFS
    (200, "Number of Islands", "Medium", "https://leetcode.com/problems/number-of-islands/"),
    (133, "Clone Graph", "Medium", "https://leetcode.com/problems/clone-graph/"),
    (695, "Max Area of Island", "Medium", "https://leetcode.com/problems/max-area-of-island/"),
    (417, "Pacific Atlantic Water Flow", "Medium", "https://leetcode.com/problems/pacific-atlantic-water-flow/"),
    (130, "Surrounded Regions", "Medium", "https://leetcode.com/problems/surrounded-regions/"),
    (994, "Rotting Oranges", "Medium", "https://leetcode.com/problems/rotting-oranges/"),
    (785, "Is Graph Bipartite?", "Medium", "https://leetcode.com/problems/is-graph-bipartite/"),
    (733, "Flood Fill", "Easy", "https://leetcode.com/problems/flood-fill/"),
    (542, "01 Matrix", "Medium", "https://leetcode.com/problems/01-matrix/"),
    (463, "Island Perimeter", "Easy", "https://leetcode.com/problems/island-perimeter/"),
    (841, "Keys and Rooms", "Medium", "https://leetcode.com/problems/keys-and-rooms/"),
    (1091, "Shortest Path in Binary Matrix", "Medium", "https://leetcode.com/problems/shortest-path-in-binary-matrix/"),
    (547, "Number of Provinces", "Medium", "https://leetcode.com/problems/number-of-provinces/"),
    (1020, "Number of Enclaves", "Medium", "https://leetcode.com/problems/number-of-enclaves/"),
    (797, "All Paths From Source to Target", "Medium", "https://leetcode.com/problems/all-paths-from-source-to-target/"),
]

phase6_advanced_graphs = [
    # Algorithms: Topological Sort, Union Find (DSU), Dijkstra, Kruskal, Prim
    (207, "Course Schedule (Topological Sort)", "Medium", "https://leetcode.com/problems/course-schedule/"),
    (743, "Network Delay Time (Dijkstra)", "Medium", "https://leetcode.com/problems/network-delay-time/"),
    (721, "Accounts Merge (Union Find)", "Medium", "https://leetcode.com/problems/accounts-merge/"),
    (210, "Course Schedule II", "Medium", "https://leetcode.com/problems/course-schedule-ii/"),
    (684, "Redundant Connection (DSU)", "Medium", "https://leetcode.com/problems/redundant-connection/"),
    (1584, "Min Cost to Connect All Points (Prim/Kruskal)", "Medium", "https://leetcode.com/problems/min-cost-to-connect-all-points/"),
    (787, "Cheapest Flights Within K Stops", "Medium", "https://leetcode.com/problems/cheapest-flights-within-k-stops/"),
    (332, "Reconstruct Itinerary", "Hard", "https://leetcode.com/problems/reconstruct-itinerary/"),
    (127, "Word Ladder", "Hard", "https://leetcode.com/problems/word-ladder/"),
    (269, "Alien Dictionary", "Hard", "https://leetcode.com/problems/alien-dictionary/"),
    (1192, "Critical Connections in a Network", "Hard", "https://leetcode.com/problems/critical-connections-in-a-network/"),
    (778, "Swim in Rising Water", "Hard", "https://leetcode.com/problems/swim-in-rising-water/"),
    (1631, "Path With Minimum Effort", "Medium", "https://leetcode.com/problems/path-with-minimum-effort/"),
    (323, "Number of Connected Components (DSU)", "Medium", "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/"),
    (261, "Graph Valid Tree", "Medium", "https://leetcode.com/problems/graph-valid-tree/"),
]

# ============================================================================
# PHASE 7: DYNAMIC PROGRAMMING (Week 8-9)
# ============================================================================

phase7_dp = [
    # Patterns: 1D DP, 2D DP, Knapsack, LIS, Interval DP
    # Algorithms: Memoization, Tabulation
    (70, "Climbing Stairs", "Easy", "https://leetcode.com/problems/climbing-stairs/"),
    (198, "House Robber", "Medium", "https://leetcode.com/problems/house-robber/"),
    (322, "Coin Change", "Medium", "https://leetcode.com/problems/coin-change/"),
    (300, "Longest Increasing Subsequence", "Medium", "https://leetcode.com/problems/longest-increasing-subsequence/"),
    (1143, "Longest Common Subsequence", "Medium", "https://leetcode.com/problems/longest-common-subsequence/"),
    (416, "Partition Equal Subset Sum (0/1 Knapsack)", "Medium", "https://leetcode.com/problems/partition-equal-subset-sum/"),
    (213, "House Robber II", "Medium", "https://leetcode.com/problems/house-robber-ii/"),
    (5, "Longest Palindromic Substring", "Medium", "https://leetcode.com/problems/longest-palindromic-substring/"),
    (62, "Unique Paths", "Medium", "https://leetcode.com/problems/unique-paths/"),
    (152, "Maximum Product Subarray", "Medium", "https://leetcode.com/problems/maximum-product-subarray/"),
    (139, "Word Break", "Medium", "https://leetcode.com/problems/word-break/"),
    (91, "Decode Ways", "Medium", "https://leetcode.com/problems/decode-ways/"),
    (309, "Best Time to Buy Stock with Cooldown", "Medium", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/"),
    (518, "Coin Change II", "Medium", "https://leetcode.com/problems/coin-change-ii/"),
    (746, "Min Cost Climbing Stairs", "Easy", "https://leetcode.com/problems/min-cost-climbing-stairs/"),
]

# ============================================================================
# PHASE 8: ADVANCED TOPICS (Week 10)
# ============================================================================

phase8_greedy = [
    # Algorithms: Activity Selection, Huffman Coding
    (55, "Jump Game", "Medium", "https://leetcode.com/problems/jump-game/"),
    (134, "Gas Station", "Medium", "https://leetcode.com/problems/gas-station/"),
    (45, "Jump Game II", "Medium", "https://leetcode.com/problems/jump-game-ii/"),
    (763, "Partition Labels", "Medium", "https://leetcode.com/problems/partition-labels/"),
    (435, "Non-overlapping Intervals", "Medium", "https://leetcode.com/problems/non-overlapping-intervals/"),
    (452, "Minimum Number of Arrows to Burst Balloons", "Medium", "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/"),
    (846, "Hand of Straights", "Medium", "https://leetcode.com/problems/hand-of-straights/"),
    (678, "Valid Parenthesis String", "Medium", "https://leetcode.com/problems/valid-parenthesis-string/"),
    (1899, "Merge Triplets to Form Target Triplet", "Medium", "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/"),
    (56, "Merge Intervals", "Medium", "https://leetcode.com/problems/merge-intervals/"),
    (57, "Insert Interval", "Medium", "https://leetcode.com/problems/insert-interval/"),
    (986, "Interval List Intersections", "Medium", "https://leetcode.com/problems/interval-list-intersections/"),
    (253, "Meeting Rooms II", "Medium", "https://leetcode.com/problems/meeting-rooms-ii/"),
    (406, "Queue Reconstruction by Height", "Medium", "https://leetcode.com/problems/queue-reconstruction-by-height/"),
    (1005, "Maximize Sum of Array After K Negations", "Easy", "https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/"),
]

phase8_trie = [
    # Trie & Word-level problems
    (208, "Implement Trie (Prefix Tree)", "Medium", "https://leetcode.com/problems/implement-trie-prefix-tree/"),
    (79, "Word Search", "Medium", "https://leetcode.com/problems/word-search/"),
    (212, "Word Search II", "Hard", "https://leetcode.com/problems/word-search-ii/"),
    (211, "Design Add and Search Words Data Structure", "Medium", "https://leetcode.com/problems/design-add-and-search-words-data-structure/"),
    (648, "Replace Words", "Medium", "https://leetcode.com/problems/replace-words/"),
    (677, "Map Sum Pairs", "Medium", "https://leetcode.com/problems/map-sum-pairs/"),
    (720, "Longest Word in Dictionary", "Medium", "https://leetcode.com/problems/longest-word-in-dictionary/"),
    (1268, "Search Suggestions System", "Medium", "https://leetcode.com/problems/search-suggestions-system/"),
    (421, "Maximum XOR of Two Numbers in an Array", "Medium", "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/"),
    (14, "Longest Common Prefix", "Easy", "https://leetcode.com/problems/longest-common-prefix/"),
    (336, "Palindrome Pairs", "Hard", "https://leetcode.com/problems/palindrome-pairs/"),
    (588, "Design In-Memory File System", "Hard", "https://leetcode.com/problems/design-in-memory-file-system/"),
    (440, "K-th Smallest in Lexicographical Order", "Hard", "https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/"),
    (745, "Prefix and Suffix Search", "Hard", "https://leetcode.com/problems/prefix-and-suffix-search/"),
    (820, "Short Encoding of Words", "Medium", "https://leetcode.com/problems/short-encoding-of-words/"),
]

phase8_binary_search = [
    # Binary Search patterns (key interview pattern)
    (704, "Binary Search", "Easy", "https://leetcode.com/problems/binary-search/"),
    (74, "Search a 2D Matrix", "Medium", "https://leetcode.com/problems/search-a-2d-matrix/"),
    (875, "Koko Eating Bananas", "Medium", "https://leetcode.com/problems/koko-eating-bananas/"),
    (153, "Find Minimum in Rotated Sorted Array", "Medium", "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"),
    (33, "Search in Rotated Sorted Array", "Medium", "https://leetcode.com/problems/search-in-rotated-sorted-array/"),
    (34, "Find First/Last Position in Sorted Array", "Medium", "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"),
    (981, "Time Based Key-Value Store", "Medium", "https://leetcode.com/problems/time-based-key-value-store/"),
    (4, "Median of Two Sorted Arrays", "Hard", "https://leetcode.com/problems/median-of-two-sorted-arrays/"),
    (162, "Find Peak Element", "Medium", "https://leetcode.com/problems/find-peak-element/"),
    (35, "Search Insert Position", "Easy", "https://leetcode.com/problems/search-insert-position/"),
    (278, "First Bad Version", "Easy", "https://leetcode.com/problems/first-bad-version/"),
    (69, "Sqrt(x)", "Easy", "https://leetcode.com/problems/sqrtx/"),
    (540, "Single Element in a Sorted Array", "Medium", "https://leetcode.com/problems/single-element-in-a-sorted-array/"),
    (1011, "Capacity To Ship Packages Within D Days", "Medium", "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/"),
    (410, "Split Array Largest Sum", "Hard", "https://leetcode.com/problems/split-array-largest-sum/"),
]

# ============================================================================
# BUILD THE FINAL TASKS LIST - ORDERED BY PHASES & WEEKS
# ============================================================================

all_topics = [
    # Phase 1: Foundations (Week 1-2)
    ("Phase 1 - Arrays", phase1_arrays, "Week 1-2"),
    ("Phase 1 - Strings", phase1_strings, "Week 1-2"),
    ("Phase 1 - Hashing", phase1_hashing, "Week 1-2"),
    # Phase 2: Linear Data Structures (Week 3)
    ("Phase 2 - Linked List", phase2_linked_list, "Week 3"),
    ("Phase 2 - Stack", phase2_stack, "Week 3"),
    ("Phase 2 - Queue & Deque", phase2_queue_deque, "Week 3"),
    # Phase 3: Recursion & Backtracking (Week 4)
    ("Phase 3 - Backtracking", phase3_backtracking, "Week 4"),
    # Phase 4: Trees (Week 5)
    ("Phase 4 - Binary Trees", phase4_binary_trees, "Week 5"),
    ("Phase 4 - BST", phase4_bst, "Week 5"),
    # Phase 5: Heap & Priority Queue (Week 6)
    ("Phase 5 - Heap & Priority Queue", phase5_heap, "Week 6"),
    # Phase 6: Graphs (Week 7)
    ("Phase 6 - Graph Traversal (BFS/DFS)", phase6_graph_traversal, "Week 7"),
    ("Phase 6 - Advanced Graphs", phase6_advanced_graphs, "Week 7"),
    # Phase 7: Dynamic Programming (Week 8-9)
    ("Phase 7 - Dynamic Programming", phase7_dp, "Week 8-9"),
    # Phase 8: Advanced Topics (Week 10)
    ("Phase 8 - Greedy & Intervals", phase8_greedy, "Week 10"),
    ("Phase 8 - Trie", phase8_trie, "Week 10"),
    ("Phase 8 - Binary Search", phase8_binary_search, "Week 10"),
]

def extract_pattern(title, topic_name):
    import re
    match = re.search(r'\((.*?)\)', title)
    if match:
        return match.group(1)
    
    title_lower = title.lower()
    topic_lower = topic_name.lower()
    
    if "two pointer" in topic_lower or "3sum" in title_lower or "two sum" in title_lower or "container" in title_lower or "palindrome" in title_lower:
        return "Two Pointers"
    if "sliding window" in topic_lower or "longest" in title_lower or "minimum window" in title_lower or "subarray sum" in title_lower:
        return "Sliding Window"
    if "prefix sum" in topic_lower or "sum" in title_lower:
        return "Prefix Sum"
    if "fast and slow" in topic_lower or "middle of" in title_lower or "duplicate number" in title_lower or "cycle" in title_lower:
        return "Fast & Slow Pointers"
    if "linked list" in topic_lower or "list" in title_lower:
        return "Linked List Traversal"
    if "binary search" in topic_lower or "search" in title_lower or "find minimum" in title_lower or "peak" in title_lower or "bad version" in title_lower or "split array" in title_lower or "capacity" in title_lower:
        return "Binary Search"
    if "stack" in topic_lower or "parentheses" in title_lower or "temperature" in title_lower or "histogram" in title_lower or "calculator" in title_lower or "evaluate" in title_lower:
        return "Monotonic Stack / Stack"
    if "queue" in topic_lower or "deque" in topic_lower or "sliding window maximum" in title_lower:
        return "Queue / Deque"
    if "backtracking" in topic_lower or "subset" in title_lower or "permutation" in title_lower or "combination" in title_lower or "n-queens" in title_lower or "word search" in title_lower or "sudoku" in title_lower:
        return "Backtracking"
    if "tree" in topic_lower or "depth" in title_lower or "ancestor" in title_lower or "level order" in title_lower or "path sum" in title_lower or "bst" in title_lower:
        return "Tree Traversal"
    if "heap" in topic_lower or "top k" in title_lower or "kth" in title_lower or "closest" in title_lower or "median" in title_lower or "merge k" in title_lower:
        return "Heap / Priority Queue"
    if "graph" in topic_lower or "island" in title_lower or "course schedule" in title_lower or "water flow" in title_lower or "surrounded regions" in title_lower or "word ladder" in title_lower:
        return "Graph Traversal"
    if "dynamic programming" in topic_lower or "climbing stairs" in title_lower or "house robber" in title_lower or "coin change" in title_lower or "longest increasing" in title_lower or "word break" in title_lower or "decode ways" in title_lower:
        return "Dynamic Programming"
    if "greedy" in topic_lower or "jump" in title_lower or "gas station" in title_lower or "interval" in title_lower or "burst balloons" in title_lower or "hand of straights" in title_lower:
        return "Greedy"
    if "trie" in topic_lower or "prefix" in title_lower or "word dictionary" in title_lower:
        return "Trie"
    if "hashing" in topic_lower or "hash" in topic_lower or "anagram" in title_lower or "duplicate" in title_lower or "ransom note" in title_lower or "isomorphic" in title_lower or "word pattern" in title_lower:
        return "Hashing"
    if "array" in topic_lower or "string" in topic_lower:
        return "Array / String Traversal"
    
    return "Think about optimal data structures!"

tasks_data = []
day = 1
problem_count = 0

for topic_name, problems, week in all_topics:
    for num, title, diff, link in problems:
        tasks_data.append({
            "day": day,
            "topic": topic_name,
            "title": title,
            "description": f"Practice problem: {title}",
            "difficulty": diff,
            "leetcode_number": num,
            "leetcode_link": link,
            "week": week,
            "type": "practice",
            "pattern": extract_pattern(title, topic_name)
        })
        problem_count += 1
        if problem_count % 3 == 0:
            day += 1

async def seed_database():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]

    # Drop existing tasks to avoid duplicates
    await db.tasks.drop()
    print("Dropped existing tasks collection")

    # Insert new tasks
    if tasks_data:
        result = await db.tasks.insert_many(tasks_data)
        print(f"Successfully seeded {len(result.inserted_ids)} tasks across {day} days")
        print(f"\nBreakdown by topic:")
        for topic_name, problems, week in all_topics:
            print(f"  [{week}] {topic_name}: {len(problems)} problems")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
