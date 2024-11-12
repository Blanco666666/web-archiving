// src/components/ThesisDetailsPanel.js
import React from 'react';

const ThesisDetailsPanel = ({ thesis, onClose }) => {
    return (
        <div className="thesis-details-panel">
            <button className="close-button" onClick={onClose}>×</button>
            <h3>{thesis.title}</h3>
            <p><strong>Author:</strong> {thesis.author}</p>
            <p><strong>Abstract:</strong> {thesis.abstract}</p>
            <p><strong>Keywords:</strong> {thesis.keywords?.join(', ')}</p>
            <p><strong>Submitted on:</strong> {new Date(thesis.submission_date).toLocaleDateString()}</p>
            {/* Add more fields as needed */}
        </div>
    );
};

export default ThesisDetailsPanel;
