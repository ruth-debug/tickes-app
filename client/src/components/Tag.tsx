import React from 'react';

interface TagProps {
    title: string;
    index?: number;
}

const Tag = ({
    title
}: TagProps) => {
    return (
      <span className="tag">{title}</span>
    );
};

export default Tag;
