import React from 'react';

interface SortComponentProps {
    sortBy: "userEmail" | "creationTime" |  "title";
    handleSortChange: (t: string) => Promise<void>;
}

const SortComponent = (props: SortComponentProps) => {
    return (
        <div>
            <h6 className='content'>Sort By</h6>
            <select className="form-select" aria-labelledby="dropdownMenuButton" onChange={(e)=> props.handleSortChange(e.target.value)}  value={props.sortBy}>
                <option value="userEmail">Email</option>
                <option value="creationTime">Date</option>
                <option value="title">Title</option>				
            </select>
        </div>
    );
};

export default SortComponent;
