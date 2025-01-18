// /lib/graphAlgorithms.ts

export type NodeGroup = {
    degree: number;
    count: number;
  };
  
  export type Restriction = {
    fromDegree: number;
    toDegree: number;
    allowed: boolean;
  };
  
  type Node = {
    id: number;
    requiredDegree: number;
    remainingDegree: number;
    groupDegree: number;
  };
  
  export type Edge = {
    from: number;
    to: number;
  };
  
  export type Graph = {
    nodes: Node[];
    edges: Edge[];
  };
  
  function isGraphPossible(
    nodeGroups: NodeGroup[],
    restrictions: Restriction[]
  ): { possible: boolean; graph?: Graph } {
    let nodes: Node[] = [];
    let nodeId = 0;
    for (const group of nodeGroups) {
      for (let i = 0; i < group.count; i++) {
        nodes.push({
          id: nodeId++,
          requiredDegree: group.degree,
          remainingDegree: group.degree,
          groupDegree: group.degree,
        });
      }
    }
  
    let edges: Edge[] = [];
  
    function canConnect(a: Node, b: Node): boolean {
      if (a.id === b.id) return false;
  
      if (
        edges.some(
          (e) =>
            (e.from === a.id && e.to === b.id) ||
            (e.from === b.id && e.to === a.id)
        )
      ) {
        return false;
      }
  
      for (const r of restrictions) {
        const cond1 =
          a.groupDegree === r.fromDegree &&
          b.groupDegree === r.toDegree &&
          !r.allowed;
        const cond2 =
          a.groupDegree === r.toDegree &&
          b.groupDegree === r.fromDegree &&
          !r.allowed;
        if (cond1 || cond2) return false;
      }
  
      return true;
    }
  
    function backtrack(): boolean {
      if (nodes.every((n) => n.remainingDegree === 0)) {
        return true;
      }
  
      const candidates = nodes.filter((n) => n.remainingDegree > 0);
      if (candidates.length === 0) return false;
      const nodeA = candidates.sort((a, b) => b.remainingDegree - a.remainingDegree)[0];
  
      for (const nodeB of nodes) {
        if (nodeB.remainingDegree <= 0) continue;
        if (!canConnect(nodeA, nodeB)) continue;
  
        edges.push({ from: nodeA.id, to: nodeB.id });
        nodeA.remainingDegree--;
        nodeB.remainingDegree--;
  
        if (backtrack()) {
          return true;
        }
  
        edges.pop();
        nodeA.remainingDegree++;
        nodeB.remainingDegree++;
      }
  
      return false;
    }
  
    if (backtrack()) {
      return { possible: true, graph: { nodes, edges } };
    } else {
      return { possible: false };
    }
  }
  
  export { isGraphPossible };
  