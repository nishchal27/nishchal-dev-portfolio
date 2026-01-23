// Utilities for converting AI-generated architecture data to React Flow format

import { Node, Edge, Position } from "reactflow";
import { ArchitectureComponent } from "@/data/architectures";

export interface AIArchitectureComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  technologies?: string[];
  tradeoffs?: string[];
  failurePoints?: string[];
  scalingNotes?: string;
}

export interface AIArchitectureConnection {
  from: string;
  to: string;
  type?: string;
}

export interface AIArchitectureData {
  architecture: {
    components: AIArchitectureComponent[];
    connections: AIArchitectureConnection[];
  };
  explanation?: string;
  tradeoffs?: string[];
  risks?: string[];
  scalingConsiderations?: string;
}

// Map AI types to our component types
function mapComponentType(aiType: string): ArchitectureComponent["type"] {
  const typeMap: Record<string, ArchitectureComponent["type"]> = {
    service: "service",
    database: "database",
    cache: "cache",
    queue: "queue",
    cdn: "cdn",
    api: "service",
    storage: "database",
    "vector-db": "vector-db",
    gateway: "gateway",
  };

  return typeMap[aiType.toLowerCase()] || "service";
}

// Get node color based on type
function getNodeColor(type: ArchitectureComponent["type"]): string {
  const colorMap: Record<ArchitectureComponent["type"], string> = {
    service: "#3b82f6", // blue
    database: "#10b981", // green
    cache: "#f59e0b", // amber
    queue: "#8b5cf6", // purple
    cdn: "#ec4899", // pink
    gateway: "#06b6d4", // cyan
    "vector-db": "#14b8a6", // teal
  };

  return colorMap[type] || "#6b7280";
}

// Generate node positions using a simple grid layout
function generateNodePositions(
  components: AIArchitectureComponent[]
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const cols = Math.ceil(Math.sqrt(components.length));
  const spacing = 250;

  components.forEach((component, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    positions.set(component.id, {
      x: col * spacing + 100,
      y: row * spacing + 100,
    });
  });

  return positions;
}

export function convertAIArchitectureToFlow(
  aiData: AIArchitectureData
): {
  nodes: Node[];
  edges: Edge[];
  components: ArchitectureComponent[];
} {
  const { architecture } = aiData;

  // Convert components
  const components: ArchitectureComponent[] = architecture.components.map(
    (comp) => ({
      id: comp.id,
      name: comp.name,
      type: mapComponentType(comp.type),
      description: comp.description,
      technologies: comp.technologies || [],
      tradeoffs: comp.tradeoffs || [],
      failurePoints: comp.failurePoints || [],
    })
  );

  // Generate positions
  const positions = generateNodePositions(architecture.components);

  // Create nodes
  const nodes: Node[] = architecture.components.map((comp) => {
    const position = positions.get(comp.id) || { x: 0, y: 0 };
    const type = mapComponentType(comp.type);

    return {
      id: comp.id,
      type: "default",
      position,
      data: {
        label: comp.name,
        type,
      },
      style: {
        background: getNodeColor(type),
        color: "#fff",
        border: "2px solid",
        borderColor: getNodeColor(type),
        borderRadius: "8px",
        padding: "10px",
        fontWeight: 500,
        minWidth: 150,
      },
    };
  });

  // Create edges
  const edges: Edge[] = architecture.connections.map((conn, idx) => ({
    id: `edge-${conn.from}-${conn.to}-${idx}`,
    source: conn.from,
    target: conn.to,
    type: "smoothstep",
    animated: true,
    style: {
      stroke: "#6b7280",
      strokeWidth: 2,
    },
    label: conn.type || "",
    labelStyle: {
      fill: "#9ca3af",
      fontSize: 10,
    },
  }));

  return { nodes, edges, components };
}
