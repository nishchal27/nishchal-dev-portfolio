"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchitectureComponent } from "@/data/architectures";
import { motion } from "framer-motion";

interface DiagramViewerProps {
  nodes: Node[];
  edges: Edge[];
  components: ArchitectureComponent[];
  onExport?: () => void;
}

export function DiagramViewer({ 
  nodes: initialNodes, 
  edges: initialEdges, 
  components,
  onExport,
}: DiagramViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent | null>(null);

  // Update nodes and edges when props change (for AI-generated updates)
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const componentMap = useMemo(
    () => new Map(components.map((c) => [c.id, c])),
    [components]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const component = componentMap.get(node.id);
      setSelectedComponent(component || null);
    },
    [componentMap]
  );

  return (
    <div className="flex gap-6 h-[600px]">
      <motion.div 
        className="flex-1 rounded-lg border border-border overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          className="bg-surface"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </motion.div>
      {selectedComponent && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <Card className="w-80 flex-shrink-0">
            <CardHeader>
              <CardTitle>{selectedComponent.name}</CardTitle>
              <CardDescription className="capitalize">{selectedComponent.type}</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-secondary">{selectedComponent.description}</p>
            
            {selectedComponent.technologies && selectedComponent.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedComponent.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2 py-1 rounded bg-surface border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedComponent.tradeoffs && selectedComponent.tradeoffs.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Tradeoffs</h4>
                <ul className="space-y-1">
                  {selectedComponent.tradeoffs.map((tradeoff, idx) => (
                    <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedComponent.failurePoints && selectedComponent.failurePoints.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Failure Points</h4>
                <ul className="space-y-1">
                  {selectedComponent.failurePoints.map((point, idx) => (
                    <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>
      )}
    </div>
  );
}
