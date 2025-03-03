import React from 'react';
import { Plus, Pencil } from 'react-bootstrap-icons';

const FloatingActionButton = () => {
  const fabStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  };

  return (
    <button
      className="btn btn-primary btn-lg rounded-circle d-flex align-items-center justify-content-center"
      style={fabStyle}
      onClick={() => alert('FAB Clicked!')}
    >
      {/* <Plus size={30} color="white"/> */}
      <Pencil size={30} color="white" />
    </button>
  );
};

export default FloatingActionButton;
