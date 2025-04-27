import React from 'react';

import './RoundAddButton.css'; 

interface AddNodeButtonProps {
  addNewNode: () => void;
}

const AddNodeButton: React.FC<AddNodeButtonProps> = ({ addNewNode }) => {
  return (
    <button className="add-node-button" onClick={addNewNode}>Add Node</button>
  );
};

export default AddNodeButton;