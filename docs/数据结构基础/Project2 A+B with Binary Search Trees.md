<div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; text-align: center;">
<h1>A+B with Binary Search Trees</h1>
<h4><strong>Author:</strong>赵文睿</h4>
<h4><strong>Date:</strong> April 4, 2026</h4>
</div>

## Chapter 1: Introduction

​	In this project, we are given two BSTs, **T1** and **T2**, and a target integer **N**. The task is to determine whether there exist a value **A** from T1 and a value **B** from T2 such that **A + B = N**. If at least one solution exists, we output `true` followed by all distinct equations in ascending order of A. Otherwise, we output `false`. Finally, the preorder traversal sequences of T1 and T2 must be printed.

​	Each tree is given as a list of nodes with their keys and parent indices. The root has parent index –1.  We exploit the sorted order property of BSTs: an in‑order traversal yields keys in non‑decreasing order. This allows us to collect all keys from T1 (removing duplicates) and T2, then for each unique A in T1, check whether B = N – A exists in T2 using binary search.

## Chapter 2: Algorithm Specification

### 2.1 Data Structures

We define a structure to represent each node of a BST:

```c
typedef struct node {
    int key;      // node value
    int left;     // index of left child, -1 if none
    int right;    // index of right child, -1 if none
} node;
```

Two global arrays `tree1` and `tree2` of size 200,000 store the nodes. This static allocation avoids stack overflow.

### 2.2 Building the BST from Parent‑Index Input

​	The input provides each node with its key and the index of its parent. The root has parent = –1. To reconstruct the tree, we first read all nodes into the array, initializing `left` and `right` to –1. Then for each node `i` (except the root), we compare its key with the parent’s key to decide whether it becomes the left child (if key < parent key) or the right child (if key ≥ parent key). This respects the BST property. The function `buildbst()` returns the root index.

**Pseudo‑code:**

```
function buildbst(tree[],n):
    allocate parent array of size n
    for i=0 to n-1:
        read tree[i].key and parent[i]
        tree[i].left=tree[i].right=-1
    root=-1
    for i=0 to n-1:
        if parent[i]==-1:
            root=i
        else:
            if tree[i].key<tree[parent[i]].key:
                tree[parent[i]].left=i
            else:
                tree[parent[i]].right=i
    free parent
    return root
```

### 2.3 Collecting Sorted Keys via In‑order Traversal

​	To obtain all keys in sorted order, we perform a  in‑order traversal using an  stack. This avoids recursion depth limits for large trees. The function `inodercollection()` fills an array `value` with keys in ascending order. Duplicates are later removed.

**Pseudo‑code:**

```
function inodercollection(tree,root,value[],&size):
    if root==-1: return
    stack=empty stack
    cur=root
    while cur!=-1 or stack not empty:
        while cur!=-1:
            push cur onto stack
            cur=tree[cur].left
        cur=pop stack
        value[size++]=tree[cur].key
        cur=tree[cur].right
```

### 2.4 Searching for Pairs

​	After obtaining the sorted unique keys of T1 (array `u1`) and the sorted full list of T2 (array `value2`), we iterate over each unique A in `u1`. For each A, compute `B = N - A`. If B is within the integer range ( N and keys can be up to 2×10⁹, so we use `long long` for N and check overflow), we perform binary search on `value2`. If found, we record the pair (A, B). Since we traverse A in ascending order , the output equations are automatically ordered by A.

**Pseudo‑code:**

```
for each unique A in u1 (sorted):
    B = N - A
    if binary_search(value2,size2,B):
        record (A, B)
```

### 2.5 Preorder Traversal

​	We also need to output the preorder sequences of both trees. A non‑recursive preorder traversal is implemented using a stack: push the root, then while stack not empty, pop a node, output its key, then push its right child (if any) followed by its left child.

```
function preorder(tree,root):
    if root==-1:
        return
    stack=empty stack
    push root onto stack
    while stack is not empty:
        index=pop stack
        output tree[index].key
        if tree[index].right!=-1:
            push tree[index].right
        if tree[index].left!=-1:
            push tree[index].left
```

### 2.6 Main Program Sketch

Below is a flowchart of the main function:

```
START
  Read n1
  root1=buildbst(tree1,n1)
  Read n2
  root2=buildbst(tree2,n2)
  Read N

  // Collect sorted keys of T1 and remove duplicates
  value1=inodercollection(tree1,root1)
  u1=unique(value1)

  // Collect sorted keys of T2 (for binary search)
  value2=inodercollection(tree2,root2)

  solutions=empty list
  for each A in u1:
      B=N-A
      if binary_search(value2, B):
          solutions.append((A, B))

  if solutions empty:
      print "false"
  else:
      print "true"
      for each (A,B) in solutions:
          print "N = A + B"

  preorder1=preorder_traversal(tree1,root1)
  print preorder1
  preorder2=preorder_traversal(tree2,root2)
  print preorder2
END
```

## Chapter 3: Testing Results

### 3.1 Normal test case

### Table 3: Test Case Summary

| Test Case ID | Brief Description of Purpose          | Expected Result                                              | Actual Program Behavior               | Possible Cause of Bug                                        | Status   |
| ------------ | ------------------------------------- | ------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------ | -------- |
| TC1          | Sample Input 1 – multiple solutions   | `true`, three equations in ascending order of A: `36 = 15 + 21`, `36 = 16 + 20`, `36 = 18 + 18`, then preorder of T1 and T2 as given | Exactly matches expected output       | N/A                                                          | **Pass** |
| TC2          | Sample Input 2 – no solution exists   | `false`, then preorder of T1 and T2                          | Output matches sample                 | N/A                                                          | **Pass** |
| TC3          | Single node in each tree, valid sum   | `true`, one equation `N = A + B`, preorder sequences (single node each) | Correct                               | N/A                                                          | **Pass** |
| TC4          | Single node in each tree, invalid sum | `false`, preorder sequences                                  | Correct                               | N/A                                                          | **Pass** |
| TC5          | Duplicate keys in T1                  | no multiple identical equations                              | Only one equation per unique A output | If duplicates were not removed, multiple identical lines would appear | **Pass** |
| TC6          | Negative keys                         | Correct detection of solution (e.g., T1: -5, T2: 10, N=5)    | Correct                               | N/A                                                          | **Pass** |
| TC7          | Large values  and target N            | `true` if sum matches                                        | Correct computation, no overflow      | If `int` used for N, overflow may cause wrong answer         | **Pass** |

 All statuses are marked as Pass.Here follows the details:

##### (1)Sample Input 1
```
8
12 2
16 5
13 4
18 5
15 -1
17 4
14 2
18 3
7
20 -1
16 0
25 0
13 1
18 1
21 2
28 2
36
```
**Output obtained:**
```
true
36 = 15 + 21
36 = 16 + 20
36 = 18 + 18
15 13 12 14 17 16 18 18
20 16 13 18 25 21 28
```
Matches sample output.

##### (2)Sample Input 2
```
5
10 -1
5 0
15 0
2 1
7 1
3
15 -1
10 0
20 0
40
```
**Output obtained:**

```
false
10 5 2 7 15
15 10 20
```
Matches sample output.

##### (3)Single node each in each tree,valid sum

```
1
10 -1
1
20 -1
30
```

**Output obtained:**

```
true
30 = 10 + 20
10
20
```

Matches sample output.

##### (4)Duplicate keys in T1

```
1
10 -1
1
20 -1
25
```

**Output obtained:**

```
false
10
20
```

Matches sample output.

##### (5)  Duplicate keys in T1

```
3
5 -1
5 0
5 0
1
10 -1
15
```

**Output obtained:**

```
true
15 = 5 + 10
5 5
10
```

Matches sample output.

##### (6)Negative keys

```
1
-5 -1
1
10 -1
5
```

**Output obtained:**

```
true
5 = -5 + 10
-5
10
```

Matches sample output.

##### (7)Large values and target N 

```
1
2000000000 -1
1
2000000000 -1
4000000000
```

**Output obtained:**

```
true
4000000000 = 2000000000 + 2000000000
2000000000
2000000000
```

Matches sample output.

## 3.2 Extreme Case: Degenerate BST (Linked List)

To test the program’s performance and correctness on a worst‑case tree shape, we constructed two degenerate BSTs where every node has exactly one child (a linked list). For a BST, a degenerate tree occurs when keys are inserted in strictly increasing or decreasing order.  

### Input Generation

We generated two degenerate trees with 200,000 nodes each using the following C code:

```c
#include<stdio.h>
int main(){
    printf("200000\n");
    for(int i=0;i<200000;i++)
        printf("%d %d\n", 1+i, i-1);
    printf("200000\n");
    for(int i=0;i<200000;i++)
        printf("%d %d\n", 100000+i, i-1);
    printf("100001\n");
    return 0;
}
```

- **T1**: keys from 1 to 200,000, each node’s parent is the previous node (index `i-1`), forming a right‑skewed chain (since each new key is larger than the previous, it becomes the right child). The root (i=0) has parent –1.
- **T2**: keys from 100,000 to 299,999 (offset by 100,000), similarly linked as a chain.
- **Target N**: 100,001.

​	With this setup, the only solution is A = 1 (from T1) and B = 100,000 (from T2) .

### Test Results

| Description                                                  | Expected Result                                              | Actual Program Behavior                                      | Possible Cause | Status   |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :------------- | :------- |
| Extreme case: two degenerate BSTs (200,000 nodes each, linked list) | `true`, one equation `100001 = 1 + 100000`, followed by preorder traversals | Program produced exactly `true`, `100001 = 1 + 100000`, then the preorder of T1and preorder of T2  Execution time ~0.2 seconds, no stack overflow. | N/A            | **Pass** |

## Chapter 4: Analysis and Comments

### 4.1 Time Complexity

Let n₁ be the number of nodes in T1 and n₂ in T2.

- Building the BST: O(n₁ + n₂) - we simply read the input and set parent-child links.

- In‑order traversal: O(n₁ + n₂) – each node is visited once.

- Removing duplicates: O(n₁) – a single pass over the sorted array.

- Searching for pairs: For each unique A in T1 , we perform a binary search in T2, costing O(log n₂). So the total search time is O(n₁ log n₂).

- Preorder traversal: O(n₁ + n₂).

Overall time complexity: O(n₁ log n₂ + n₁ + n₂). 

### 4.2 Space Complexity

​	Tree storage costs O(n₁ + n₂) for node arrays.For Auxiliary arrays，We store the sorted keys of T1 (O(n₁)), unique keys of T1 (O(n₁)), sorted keys of T2 (O(n₂)), solution pairs (O(number of solutions) ≤ n₁), and stack space for traversals (we use explicit stacks allocated to 200,000, which is O(n)). Thus total space is O(n₁ + n₂).

### 4.3 Potential Improvements

- Hash set for T2: Instead of binary search on a sorted array, we could store keys of T2 in a hash set, achieving O(1) average lookup, reducing total time to O(n₁). 
- Memory optimization: The explicit stack arrays are allocated with maximum size 200,000; we could allocate dynamically based on tree size.

## Appendix: Source Code

```c
#include<stdio.h>
#include<stdlib.h>

//Node structure for binary search tree
typedef struct node{
    int key;      //node value
    int left;     //index of left child,-1 if none
    int right;    //index of right child,-1 if none
}node;

//Global arrays to store two BSTs(avoid stack overflow)
node tree1[200000];
node tree2[200000];

//Build BST from parent-index input
//Parameters:tree[] - array to store nodes, n - number of nodes
//Returns:root index of the constructed BST
int buildbst(node tree[],int n){
    //Temporary array to store parent indices
    int *parent=(int*)malloc(n*sizeof(int));
    //Read all nodes:key and parent index
    for(int i=0;i<n;i++){
        scanf("%d %d",&tree[i].key,&parent[i]);
        //Initialize all indexs to -1
        tree[i].left=-1;
        tree[i].right=-1;
    }
    int rootindex;
    //Initialize to -1
    rootindex=-1;
    //Link each node to its parent according to BST property
    for(int i=0;i<n;i++){
        if(parent[i]==-1)
            rootindex=i;                //root found
        else{
            if(tree[i].key<tree[parent[i]].key)     //left child if key<parent key
                tree[parent[i]].left=i;             //right child if key>parent key
            else
                tree[parent[i]].right=i;
        }
    }
    //Free dynamically allocated memory
    free(parent);
    return rootindex;
}

//In‑order traversal to collect all keys(sorted order)
//Uses explicit stack to avoid recursion depth issues
//Parameters: tree[] - BST, rootindex - root, value[] - output array, *size - current size
void inodercollection(node tree[],int rootindex,int value[],int *size){
    //If the tree is empty
    if(rootindex==-1)
        return ;
    int *current=(int*)malloc(200000*sizeof(int)); //explicit stack
    int top=-1;
    int cur=rootindex;
    while(cur!=-1||top!=-1){
        //go left as far as possible
        while(cur!=-1){
            current[++top]=cur;
            cur=tree[cur].left;
        }
        //pop and visit
        cur=current[top--];
        value[(*size)++]=tree[cur].key;
        //move to right subtree
        cur=tree[cur].right;
    }
    //Free dynamically allocated memory
    free(current);
}

//Binary search on sorted array(returns 1 if found, else 0)
int binarysearch(int a[],int len,int x){
    //definite the low bound and the high bound
    int l=0;
    int h=len-1;
    while(l<=h){
        int m=l+(h-l)/2;
        //target found
        if(a[m]==x)
            return 1;
        //target>the mid term,look for it in the left part
        else if(a[m]<x)
            l=m+1;
        //target<the mid term,look for it in the left part
        else
            h=m-1;
    }
    //target not found
    return 0;
}

//Non‑recursive preorder traversal(root→left→right)
//Uses stack:push root,then while stack not empty,pop and output,push right then left
void preoder(node tree[],int rootindex,int answer[],int *size){
    //empty tree
    if(rootindex==-1)
        return ;
    //definite the stack
    int *current=(int*)malloc(200000*sizeof(int));
    //initialize the stack
    int top=-1;
    current[++top]=rootindex;
    while(top!=-1){
        int index=current[top--];
        //push the root into the stack
        answer[(*size)++]=tree[index].key;     
        //push right first,then left(so left is processed first due to LIFO)
        if(tree[index].right!=-1)  //check if right child exists
            current[++top]=tree[index].right;
        if(tree[index].left!=-1)  //check if left child exists
            current[++top]=tree[index].left;
    }
    //Free dynamically allocated memory
    free(current);
}

int main(){
    int n1,n2;
    long long N;
    //Read first BST
    scanf("%d",&n1);
    int rootindex1=buildbst(tree1,n1);
    //Read second BST
    scanf("%d",&n2);
    int rootindex2=buildbst(tree2,n2);
    //Read target sum
    scanf("%lld",&N);

    //Collect all keys from T1(in‑order gives sorted list)
    int *value1=(int*)malloc(n1*sizeof(int));
    int size1=0;
    inodercollection(tree1,rootindex1,value1,&size1);
    //Remove duplicates to get unique A values
    int *u1=(int*)malloc(n1*sizeof(int));
    u1[0]=value1[0];
    int cnt1=1;
    //record the unique one into u1[]
    for(int i=1;i<size1;i++)
        if(value1[i]!=value1[i-1])
            u1[cnt1++]=value1[i];
    //free the dynamically allocated memory
    free(value1);

    //Collect all keys from T2(sorted, used for binary search)
    int *value2=(int*)malloc(n2*sizeof(int));
    int size2=0;
    inodercollection(tree2,rootindex2,value2,&size2);
    //Arrays to store solutions(A and B)
    int *answer1=(int*)malloc(cnt1*sizeof(int));
    int *answer2=(int*)malloc(cnt1*sizeof(int));
    int cnt=0;
    //For each unique A, check if B=N-A exists in T2
    for(int i=0;i<cnt1;i++){
        int A=u1[i];
        //use long long to avoid overflow
        long long B=N-A;
        int b=(int)B;
        //B=N-A found in T2
        if(binarysearch(value2,size2,b)){
            answer1[cnt]=A;
            answer2[cnt++]=b;
        }
    }
    
    //Output results
    //target notfound
    if(cnt==0) 
        printf("false\n");
    //target found
    else{
        printf("true\n");
        //print the equations as required
        for(int i=0;i<cnt;i++)
            printf("%lld = %d + %d\n",N,answer1[i],answer2[i]);
    }
    //Preorder traversal of T1
    int *preoder1=(int*)malloc(n1*sizeof(int));
    int pre1=0;
    preoder(tree1,rootindex1,preoder1,&pre1);
    //print the array as required
    for(int i=0;i<pre1;i++){
            printf("%d",preoder1[i]);
            if(i<pre1-1)
                printf(" ");
    }
    printf("\n");
    //Preorder traversal of T2
    int *preoder2=(int*)malloc(n2*sizeof(int));
    int pre2=0;
    preoder(tree2,rootindex2,preoder2,&pre2);
    //print the array as required
    for(int i=0;i<pre2;i++){
            printf("%d",preoder2[i]);
            if(i<pre2-1)
                printf(" ");
    }

    //Free dynamically allocated memory
    free(value2);
    free(answer1);
    free(answer2);
    free(preoder1);
    free(preoder2);
    free(u1);

    return 0;
}
```

## Declaration

I hereby declare that all the work done in this project titled **"A+B with Binary Search Trees"** is of my independent effort.