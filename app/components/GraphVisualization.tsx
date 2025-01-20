import React, { useRef, useEffect } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

interface NodeType {
  id: number;
  groupDegree: number;
}

interface EdgeType {
  from: number;
  to: number;
}

interface Graph {
  nodes: NodeType[];
  edges: EdgeType[];
}

interface GraphVisualizationProps {
  graph: Graph | null;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ graph }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && graph) {
      const visNodes = new DataSet(
        graph.nodes.map((node) => ({
          id: node.id,
          label: `Grad: ${node.groupDegree}`,
        }))
      );

      const visEdges = new DataSet(
        graph.edges.map((edge, index) => ({
          id: index,
          from: edge.from,
          to: edge.to,
        }))
      );

      const data = {
        nodes: visNodes,
        edges: visEdges,
      };

      const options = {
        edges: {
          smooth: {
            enabled: true,
            type: "continuous",
            roundness: 0.5,
          },
        },
        physics: {
          stabilization: false,
        },
        layout: {
          improvedLayout: true,
        },
      };

      // Initialisiere das Netzwerk
      new Network(containerRef.current, data, options);
    }
  }, [graph]);

  return <div ref={containerRef} className="w-full h-96 border rounded mt-4" />;
};

export default GraphVisualization;
