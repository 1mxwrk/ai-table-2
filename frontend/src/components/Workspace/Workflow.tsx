import { useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap, 
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Position,
  Node, 
  Edge 
} from '@xyflow/react'; 
import '@xyflow/react/dist/style.css';

import { TooltipNode, TooltipContent, TooltipTrigger } from '@/components/tooltip-node';


import AddNodeButton from './AddNodeButton';

// Define initial nodes with proper Node type
const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' }},
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

// interface GraphData {
//   nodes: Node[];
//   edges: Edge[];
// }

// // Define the shape of node data
// interface NodeData {
//   label: string;
//   [key: string]: any; // Allow for additional properties
// }



export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Add new node
  const addNewNode = useCallback(() => {
    // Calculate position to place nodes in a more horizontal layout
    const xOffset = nodes.length > 0 ? Math.max(...nodes.map(n => n.position.x)) + 200 : 100;
    const yOffset = nodes.length > 0 ? Math.min(...nodes.map(n => n.position.y)) + Math.random() * 100 - 50 : 150;
    
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: 'tooltip',
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: xOffset, y: yOffset },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);
  


  function Tooltip() {
    return (
      <TooltipNode>
        <TooltipContent position={Position.Top}>Hidden Content</TooltipContent>
        <TooltipTrigger>Hover</TooltipTrigger>
      </TooltipNode>
    );
  }

  const nodeTypes = {
    tooltip: Tooltip,
  };
  
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}>
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <MiniMap />
        <Controls />
      </ReactFlow>
      <AddNodeButton addNewNode={addNewNode} />
    </div>
  );
}