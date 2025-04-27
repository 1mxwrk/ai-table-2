import React, { memo } from 'react';
import { Position } from '@xyflow/react';
 
import CustomHandle from './CustomHandle';
 
import './index.css';

const CustomNode = () => {
  return (
    <div>
      <CustomHandle
        type="source"
        position={Position.Left}
        connectionCount={1}
      />
      <div>Connection Limit 1</div>
      <CustomHandle
        type="target"
        position={Position.Right}
        connectionCount={1}
      />
    </div>
  );
};
 

export default memo(CustomNode);