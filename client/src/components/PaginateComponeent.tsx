import React from 'react';
import ReactPaginate from 'react-paginate';
import { TicketsResult } from '../api';

interface PaginateComponentProps {
    ticketsResult: TicketsResult;
    handlePaginateChange: (event: { selected: number; }) => Promise<void>;
}

const PaginateComponent = (props: PaginateComponentProps) => {
    return (
        <nav aria-label="Page navigation tickets" className="mt-4 ">

        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
             onPageChange={props.handlePaginateChange}
            pageRangeDisplayed={5}
             pageCount={props.ticketsResult.pages}
            previousLabel="< previous"
            forcePage={props.ticketsResult.page - 1}
            renderOnZeroPageCount={undefined}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
        />
     </nav>
    );
};

export default PaginateComponent;
