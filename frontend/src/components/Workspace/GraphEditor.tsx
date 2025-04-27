import React, { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
  NodeTypes
} from '@xyflow/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
 
interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// Define the shape of node data
interface NodeData {
  label: string;
  [key: string]: any; // Allow for additional properties
}

// Custom node component with handles on left and right sides
const HorizontalNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div style={{ 
      padding: '10px', 
      borderRadius: '5px', 
      border: '1px solid #ddd',
      backgroundColor: 'white',
      minWidth: '150px',
      minHeight: '40px',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Input handle on the left side */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          background: '#555',
          width: '10px',
          height: '10px',
          left: '-5px'
        }}
      />
      
      {/* Node content */}
      <div>{data.label}</div>
      
      {/* Output handle on the right side */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          background: '#555',
          width: '10px',
          height: '10px',
          right: '-5px'
        }}
      />
    </div>
  );
};

// // Define node types
// const nodeTypes: NodeTypes = {
//   horizontalNode: HorizontalNode,
// };

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const GraphEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Load graph data
  const { isLoading } = useQuery({
    queryKey: ['graph'],
    queryFn: async () => {
      const response = await axios.get<{ data: GraphData }>('/api/graph');
      // Ensure all nodes use the horizontalNode type
      const formattedNodes = (response.data.data.nodes || []).map(node => ({
        ...node,
        type: 'horizontalNode'
      }));
      setNodes(formattedNodes);
      setEdges(response.data.data.edges || []);
      return response.data.data;
    },
  });

  // Save graph data
  const { mutate: saveGraph } = useMutation({
    mutationFn: (data: GraphData) => 
      axios.post('/api/graph', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graph'] });
    },
  });

  // Auto-save when graph changes
  const debouncedSave = useCallback(() => {
    saveGraph({ nodes, edges });
  }, [nodes, edges, saveGraph]);

  // Handle graph changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        debouncedSave();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [nodes, edges, debouncedSave]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add new node
  const addNewNode = useCallback(() => {
    // Calculate position to place nodes in a more horizontal layout
    const xOffset = nodes.length > 0 ? Math.max(...nodes.map(n => n.position.x)) + 200 : 100;
    const yOffset = nodes.length > 0 ? Math.min(...nodes.map(n => n.position.y)) + Math.random() * 100 - 50 : 150;
    
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      // type: 'horizontalNode', // Use our custom node type
      type: 'custom',
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: xOffset, y: yOffset },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    // <div style={{ height: '75vh', width: '100%', position: 'relative' }}>
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <button 
        className="add-node-button"
        onClick={addNewNode}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          color: 'white',
          fontSize: '24px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
        }}
      >
        +
      </button>
    </div>
  );
};

export default GraphEditor;