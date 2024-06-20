import React from 'react';

interface SpacerProps {
    // Default will be 3rem
    height?: string;
    width?: string;
}

const Spacer: React.FC<SpacerProps> = ({ height = '3rem', width = '3rem' }) => {
    const style = {
        height,
        width
    };

    return <div style={style} />;
};

export default Spacer;
