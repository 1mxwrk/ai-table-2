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
} from '@xyflow/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

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
      setNodes(response.data.data.nodes || []);
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
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div className="graph-controls">
        <button className="graph-button" onClick={addNewNode}>
          Add Node
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default GraphEditor;