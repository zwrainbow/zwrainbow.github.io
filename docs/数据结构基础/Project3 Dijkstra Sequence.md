<div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; text-align: center;">
<h1>Dijkstra Sequence</h1>
<h4><strong>Author:</strong>赵文睿</h4>
<h4><strong>Date:</strong>May 9th, 2026</h4>
</div>


## Chapter 1:Introduction

​	Given a connected undirected graph with positive edge weights, a *Dijkstra sequence* is the order in which Dijkstra's algorithm extracts vertices from the source. The algorithm always selects an unvisited vertex with the smallest current distance. When multiple vertices share the same minimum, any can be chosen, so multiple Dijkstra sequences may exist. We are given up to 100 queries, each a permutation of all vertices . We must output `Yes` if the permutation is a valid Dijkstra sequence, otherwise `No`.

​	In Dijkstra's algorithm, the vertex picked at each step **must** have the smallest distance among all unvisited vertices. To verify a sequence, we simulate the algorithm but force the given order. At each step we check whether the forced vertex indeed has the global minimum distance.

**Solution outline:**Build an adjacency list for the graph. For each query:

- Initialise distances (0 for source, ∞ for others).
- Walk through the sequence. At vertex `u`:
	- Find the minimum distance over all unvisited vertices.
	- If `dist[u]` ≠ that minimum → return `No`.
	- Mark `u` visited and relax its neighbours.
- If all steps pass → return `Yes`.

## Chapter 2:Algorithm Specification

### 2.1 Data Structures

​	We represent the graph using an **adjacency list** because the graph is sparse (\(N_e\) up to \(10^5\) while \(N_v\) up to \(10^3\)). Each edge is stored as a node in a linked list.

```c
typedef struct edge {
    int to;          // destination vertex
    int weight;      // edge weight (positive integer ≤100)
    struct edge* next;
} edge;

edge* graph[1005];   // array of head pointers, graph[v] points to first edge from v
```

​	Global variables `nv` (number of vertices) and `ne` (number of edges) are used throughout.

### 2.2 Building the Graph

​	The function `build(int a, int b, int w)` adds an undirected edge between `a` and `b`. Because the graph is undirected, two directed edges are inserted: `a→b` and `b→a`. Both are added at the head of the respective adjacency lists.

**Pseudo‑code **

```
function build(a,b,w):
    e1=new edge
    e1.to=b
    e1.weight=w
    e1.next=graph[a]
    graph[a]=e1

    e2=new edge
    e2.to=a
    e2.weight=w
    e2.next=graph[b]
    graph[b]=e2
```

### 2.3 Verifying a Dijkstra Sequence

​	The function `judge(int *seq, int n)` checks whether the given permutation `seq` of length `n` (where `n = nv`) is a valid Dijkstra sequence. The algorithm simulates Dijkstra step by step, forcing the choice of `seq[i]` at step `i`. At each step it ensures that the forced vertex has the smallest distance among all unvisited vertices.

**Pseudo‑code :**

```
function judge(seq[],n):
    let dist[1..nv],visited[1..nv]=false
    for i=1 to nv:
        dist[i]=INF
    source=seq[0]
    dist[source]=0

    for i=0 to n-1:
        u=seq[i]
        // Find global minimum distance among unvisited vertices
        minDist=INF
        for j=1 to nv:
            if not visited[j] and dist[j]<minDist:
                minDist=dist[j]
        // Required condition
        if dist[u]!=minDist:
            return false
        visited[u]=true
        // Relax neighbours of u
        e=graph[u]
        while e!=NULL:
            v=e.to
            w=e.weight
            if not visited[v] and dist[u]+w<dist[v]:
                dist[v]=dist[u]+w
            e=e.next
    return true
```

### 2.4 Main Program Workflow

The `main` function reads the graph, then processes each query:

text

```
read nv, ne
for i=1 to ne:
    read a,b,w
    build(a,b,w)
read k
allocate seq array of size nv
for each query:
    for j=0tonv-1:
        read seq[j]
    if judge(seq,nv) then print "Yes" else print "No"
free memory
```

## Chapter 3: Testing Results

### 3.1 Test Case Summary

| Test Case ID | Brief Description of Purpose                                 | Expected Result                                         | Actual Program Behavior | Possible Cause of Bug | Status   |
| :----------- | :----------------------------------------------------------- | :------------------------------------------------------ | :---------------------- | :-------------------- | :------- |
| TC1          | Sample Input (5 vertices, 7 edges, 4 queries)                | Yes, Yes, Yes, No                                       | Matches expected        | None                  | **Pass** |
| TC2          | Single vertex, no edges                                      | Yes                                                     | Matches expected        | None                  | **Pass** |
| TC3          | Two vertices, one edge (source must be first)                | Yes for [1,2]; No for [2,1]                             | Matches expected        | None                  | **Pass** |
| TC4          | Three vertices in a line (1‑2‑3). Sequence [1,3,2] is invalid because at step2 dist[3]=2 but minDist=1 | No for [1,3,2]                                          | Matches expected        | None                  | **Pass** |
| TC5          | Triangle with equal weights (ties allowed). Both sequences valid | Yes for [1,2,3] and [1,3,2]                             | Matches expected        | None                  | **Pass** |
| TC6          | Large random graph (Nv=1000, E=50000), valid sequence generated by Dijkstra and random permutation | Yes fort the first part and then No for the second part | Matches expecte         | None                  | **Pass** |

### 3.2 Detailed Test Cases

#### (1) TC1 – Sample Input from Problem Statement

**Input:**

```
5 7
1 2 2
1 5 1
2 3 1
2 4 1
2 5 2
3 5 1
3 4 1
4
5 1 3 4 2
5 3 1 2 4
2 3 4 5 1
3 2 1 5 4
```

**Output:**

```
Yes
Yes
Yes
No
```

**Status:** Pass

#### (2) TC2 – Single Vertex

**Input:**

```
1 0
1
1
```

**Expected Output:**

```
Yes
```

**Status:** Pass

#### (3) TC3 – Two Vertices, One Edge

Graph: 1‑2 (weight=5). Two queries: first with source=1, second with source=2 

**Input:**

```
2 1
1 2 5
2
1 2
2 1
```

**Output:**

```
Yes
Yes
```

**Status:** Pass

#### (4) TC4 – Three Vertices in a Line (1‑2‑1, 2‑3‑1)

Source = 1. The valid Dijkstra order is [1,2,3]. The sequence [1,3,2] is invalid.

```
3 2
1 2 1
2 3 1
2
1 2 3
1 3 2
```

**Output:**

```
Yes
No
```

**Status:** Pass

#### (5) TC5 – Triangle with Equal Weights (all edges weight 2)

Source = 1. Both vertices 2 and 3 receive distance 2 after initialization, so either can be chosen second. Both permutations [1,2,3] and [1,3,2] are valid Dijkstra sequences.

**Input:**

```
3 3
1 2 2
2 3 2
1 3 2
2
1 2 3
1 3 2
```

**Output:**

```
Yes
Yes
```

**Status:** Pass

#### (6) TC6 – Large random graph 

​	The purpose is to verify that the program correctly handles a large graph (1000 vertices, 50000 edges) and correctly identifies a valid Dijkstra sequence (returning `Yes`) while rejecting random permutations (returning `No`).

​	A separate C program (`gen.c`) generates a connected undirected graph with random edge weights (1–100). It first builds a random spanning tree to guarantee connectivity, then adds additional random edges until exactly 50,000 edges are created. From source vertex 1, it runs a O(N²) Dijkstra algorithm to obtain a valid Dijkstra sequence. It then outputs 25 copies of this same valid sequence followed by 25 different random permutations. Thus the total number of queries is 50.

​	For a graph with 1000 vertices, the total number of possible permutations is 1000!, an astronomically large number. The chance that a uniformly random permutation coincides with a specific valid Dijkstra sequence (or even any valid Dijkstra sequence) is infinitesimally small – far below any practical concern. Therefore, the probability of a false positive (a random permutation accidentally being a valid Dijkstra sequence) is negligible.

**Output:** `Yes` repeated 25 times (one for each valid sequence), then `No` repeated 25 times (for the random permutations,which can be).
**Status:** Pass

**Generation Code**:

```c
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<time.h>
#include<limits.h>

#define MAXN 1005     // maximum number of vertices
#define MAXE 100005   // maximum number of edges
#define INF INT_MAX   // infinity

// edge structure for adjacency list (same as main.c)
typedef struct edge{
    int to;           // destination vertex
    int weight;       // edge weight
    struct edge* next;//next_pointer
}edge;

edge* graph[MAXN];    // adjacency list head pointers
int nv,ne;            // number of vertices, number of edges
int visited[MAXN];    // visited flag for Dijkstra
int dist[MAXN];       // distance array for Dijkstra
int parent[MAXN];     // parent array for union-find

// add an undirected edge between a and b with weight w
void build(int a,int b,int w){
    // allocate and insert a->b at head of graph[a]
    edge* e1=(edge*)malloc(sizeof(edge));//allocate_edge
    e1->to=b;//set_dest
    e1->weight=w;//set_weight
    e1->next=graph[a];//link_to_head
    graph[a]=e1;//update_head

    // allocate and insert b->a at head of graph[b]
    edge* e2=(edge*)malloc(sizeof(edge));//allocate_edge
    e2->to=a;//set_dest
    e2->weight=w;//set_weight
    e2->next=graph[b];//link_to_head
    graph[b]=e2;//update_head
}

// union-find find with path compression
int find(int x){
    return parent[x]==x?x:(parent[x]=find(parent[x]));//path_compression
}

// union two disjoint sets
void unionSet(int a,int b){
    a=find(a);
    b=find(b);
    if(a!=b) parent[a]=b;//union
}

// generate random edge weight in [1,100]
int randWeight(){
    return (rand()%100)+1;//range_1_to_100
}

// run Dijkstra from source, record extraction order in seq[]
void dijkstraSequence(int source,int seq[]){
    // initialise distances and visited flags
    for(int i=1;i<=nv;i++){
        dist[i]=INF;
        visited[i]=0;
    }
    dist[source]=0;

    // each step extracts one vertex
    for(int step=0;step<nv;step++){
        int u=-1;
        int minDist=INF;
        // linear scan to find the unvisited vertex with smallest distance
        for(int i=1;i<=nv;i++){
            if(!visited[i]&&dist[i]<minDist){
                minDist=dist[i];
                u=i;
            }
        }
        seq[step]=u;      // record the chosen vertex
        visited[u]=1;

        // relax all neighbours of u
        edge* e=graph[u];
        while(e){
            int v=e->to;
            int w=e->weight;
            if(!visited[v]&&dist[u]+w<dist[v]){
                dist[v]=dist[u]+w;//relax
            }
            e=e->next;
        }
    }
}

// generate a random permutation of vertices 1..nv
void randomPermutation(int seq[]){
    // initialise with increasing order
    for(int i=0;i<nv;i++) seq[i]=i+1;
    // Fisher-Yates shuffle
    for(int i=nv-1;i>0;i--){
        int j=rand()%(i+1);
        int tmp=seq[i];
        seq[i]=seq[j];
        seq[j]=tmp;
    }
}

int main(){
    srand((unsigned)time(NULL));   // seed random generator
    nv=1000;
    ne=50000;

    // initialise adjacency list and union-find
    for(int i=1;i<=nv;i++){
        graph[i]=NULL;
        parent[i]=i;
    }

    // ---------- step 1: build a random spanning tree to ensure connectivity ----------
    int order[MAXN];
    for(int i=0;i<nv;i++) order[i]=i+1;
    // random shuffle of vertex order
    for(int i=nv-1;i>0;i--){
        int j=rand()%(i+1);
        int tmp=order[i];
        order[i]=order[j];
        order[j]=tmp;
    }
    // connect each new vertex to a random previous vertex
    for(int i=1;i<nv;i++){
        int u=order[i];
        int idx=rand()%i;
        int v=order[idx];
        int w=randWeight();
        build(u,v,w);
        unionSet(u,v);
    }

    // ---------- step 2: add remaining random edges until reaching ne edges ----------
    int edgeCount=nv-1;   // already have nv-1 tree edges
    char hasEdge[MAXN][MAXN]={{0}};   // quick duplicate detection
    // mark existing tree edges
    for(int i=1;i<=nv;i++){
        edge* e=graph[i];
        while(e){
            int j=e->to;
            if(i<j) hasEdge[i][j]=1;
            e=e->next;
        }
    }
    // keep adding random edges until we have exactly ne edges
    while(edgeCount<ne){
        int u=rand()%nv+1;
        int v=rand()%nv+1;
        if(u==v) continue;               // no self-loops
        if(u>v){ int t=u; u=v; v=t; }    // store with u<v
        if(hasEdge[u][v]) continue;      // edge already exists
        int w=randWeight();
        build(u,v,w);
        hasEdge[u][v]=1;
        edgeCount++;
    }

    // ---------- generate a valid Dijkstra sequence (source = 1) ----------
    int validSeq[MAXN];
    dijkstraSequence(1,validSeq);

    // ---------- output in the required format ----------
    printf("%d %d\n",nv,ne);
    // output each undirected edge only once (i < e->to)
    for(int i=1;i<=nv;i++){
        edge* e=graph[i];
        while(e){
            if(i<e->to){
                printf("%d %d %d\n",i,e->to,e->weight);
            }
            e=e->next;
        }
    }

    // 50 queries: 25 valid Dijkstra sequences + 25 random permutations
    printf("50\n");

    // 25 copies of the same valid Dijkstra sequence (source = 1)
    for(int q=0;q<25;q++){
        for(int i=0;i<nv;i++){
            printf("%d%c",validSeq[i],(i==nv-1?'\n':' '));
        }
    }

    // 25 different random permutations
    for(int q=0;q<25;q++){
        int randSeq[MAXN];
        randomPermutation(randSeq);
        for(int i=0;i<nv;i++){
            printf("%d%c",randSeq[i],(i==nv-1?'\n':' '));
        }
    }

    // free dynamically allocated memory
    for(int i=1;i<=nv;i++){
        edge* e=graph[i];
        while(e){
            edge* tmp=e;
            e=e->next;
            free(tmp);
        }
    }
    return 0;//exit
}
```



## Chapter 4: Analysis and Comments

### 4.1 Time Complexity

For each query, the `judge` function:

- Initialises `dist` and `visited`: O(Nv)
- For each of Nv steps:
	- Scans all Nv vertices to find `minDist`: O(Nv)
	- Relaxes edges of the current vertex. Over all steps, each edge is examined at most once (when its source vertex is visited). Total relaxation cost: O(Ne)
		Thus **per query time** = O(Nv² + Ne).

### 4.2 Space Complexity

- Adjacency list: O(Nv + Ne) (each edge stored twice)
- `dist` and `visited` arrays: O(Nv)
- Input sequence array: O(Nv)
	Total: **O(Nv + Ne)**.

### 4.3 Possible Improvements

1. **Priority queue** – For larger Nv (e.g., 10⁵), replacing the linear scan with a binary heap would reduce the per‑query complexity to O((Nv+Ne) log Nv).
2. **Early exit in minDist scan** – If during the scan we find a vertex with distance smaller than `dist[seq[i]]`, we can return `false` immediately.
3. **Use `long long` for distances** – Although weights and Nv are small, using `long long` would prevent any potential overflow if distances are summed (not required here).

## Appendix: Source Code 

```c
#include<stdio.h>   // standard input/output
#include<stdlib.h>  // dynamic memory allocation
#include <limits.h> // INT_MAX for infinity

// edge structure for adjacency list
typedef struct edge{
    int to;          // destination vertex
    int weight;      // edge weight (positive integer)
    struct edge* next; // next edge in the list
}edge;

int nv,ne;          // number of vertices, number of edges
edge* graph[1005];  // adjacency list: head pointers for vertices 1..1000

// add an undirected edge between a and b with weight w
void build(int a,int b,int w){
    // create edge a -> b and insert at head of graph[a]
    edge* e1=(edge*)malloc(sizeof(edge));
    e1->to=b;
    e1->weight=w;
    e1->next=graph[a];
    graph[a]=e1;

    // create edge b -> a and insert at head of graph[b]
    edge* e2=(edge*)malloc(sizeof(edge));
    e2->to=a;
    e2->weight=w;
    e2->next=graph[b];
    graph[b]=e2;
}

// check whether sequence a[0..n-1] is a valid Dijkstra sequence
int judge(int *a,int n){
    int d[1005];           // distance array
    int visited[1005]={0}; // visited flags

    // initialise distances to infinity
    for(int i=1;i<=nv;i++)
        d[i]=INT_MAX;
    d[a[0]]=0;             // source vertex has distance 0

    // simulate Dijkstra step by step following the given order
    for(int i=0;i<n;i++){
        int u=a[i];        // vertex forced at this step
        int min=INT_MAX;
        // find the smallest distance among unvisited vertices
        for(int j=1;j<=nv;j++)
            if(!visited[j]&&d[j]<min)
                min=d[j];
        // if forced vertex does not have that minimum -> invalid
        if(d[u]!=min)
             return 0;
        visited[u]=1;      // mark as visited

        // relax all neighbours of u
        edge* e=graph[u];
        while(e){
            if(!visited[e->to]&&d[u]+e->weight<d[e->to])
                d[e->to]=d[u]+e->weight;
            e=e->next;
        }
    }
    return 1;              // all steps satisfied
}

int main(){
    // read number of vertices and edges
    scanf("%d %d",&nv,&ne);
    // build the graph
    for(int i=0;i<ne;i++){
        int a,b,w;
        scanf("%d %d %d",&a,&b,&w);
        build(a,b,w);
    }
    // read number of queries
    int k;
    scanf("%d",&k);
    int* a=(int*)malloc(nv*sizeof(int)); // buffer for one sequence
    // process each query
    for(int i=0;i<k;i++){
        // read a permutation of nv vertices
        for(int j=0;j<nv;j++)
            scanf("%d",&a[j]);
        // output verdict
        if(judge(a,nv))
            printf("Yes\n");
        else
            printf("No\n");
    }

    // free all dynamically allocated edges
    for(int i=1;i<=nv;i++){
        edge* e=graph[i];
        while(e){
            edge* tmp=e;
            e=e->next;
            free(tmp);
        }
    }
    free(a);  // free sequence buffer
    return 0;
}
```

## Declaration

I hereby declare that all the work done in this project titled **"Dijkstra Sequence"** is of my independent effort.