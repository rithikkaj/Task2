import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const typeClasses = {
    success: 'bg-green-50 border-l-4 border-green-500 text-green-700',
    error: 'bg-red-50 border-l-4 border-red-500 text-red-700',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700',
    info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-700',
  };

  return (
    <div className={`p-4 mb-4 rounded ${typeClasses[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl font-bold hover:opacity-70"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
