import React from 'react';
import { Loader } from 'lucide-react';
import './LoadingState.css';

const LoadingState = () => (
    <div className="loadingBox">
        <Loader className="loader" />
        <p className="loadingText">Loading Application...</p>
    </div>
);

export default LoadingState;