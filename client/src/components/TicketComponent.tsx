import React from 'react';
import { Ticket } from '../api';
import TagsComponent from './TagsComponent';


interface TicketProps {
    tickets: Ticket[];
    favorite: boolean;
    handleToggle: (t: Ticket) => (void);
}

const TicketsComponent = (props: TicketProps) => {
    return (
        <>
        {
            props.tickets.map((ticket: Ticket) => (<li key={ticket.id} className='ticket'>
            <h5 className='title'>{ticket.title}</h5>
            <h6 className='content'>{ticket.content}</h6>
            {ticket.labels && <TagsComponent tags={ticket.labels}/>}
            <footer>
                <div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()} | {<button type="button" className="btn btn-outline-primary btn-sm" onClick={(e) => props.handleToggle(ticket)}><span className="bi bi-pin"></span> {props.favorite ? "Remove from Favorites": "Add to Favorites"}</button>}</div>
            </footer>
        </li>))
        }
        </>
        
    );
};

export default TicketsComponent;