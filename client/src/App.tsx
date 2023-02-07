import React, {useEffect, useState} from 'react';
import './App.scss';
import {createApiClient, FilterProps, Ticket, TicketsResult} from './api';
import ReactPaginate from 'react-paginate';
import TicketsComponent from './components/TicketComponent';
export type AppState = {
    offset: number,
	ticketsResult?: TicketsResult,
	options: FilterProps,
	favoriteTickes: Ticket[]
}

const api = createApiClient();
export class App extends React.PureComponent<{}> {
    
	state: AppState = {
		offset: 0,
		options: {
			search: '',
			page: 1,
			limit: 10,
			sortBy: "creationTime"
		},
		favoriteTickes: []
	}


	searchDebounce: any = null;

	async componentDidMount() {
		const ticketResult =  await api.getTickets();

		this.setState( (prev) =>  ({
           ...prev ,ticketsResult: ticketResult
		})
		);
	}

	sortItems = (currentSort : "userEmail" | "creationTime" |  "title") => {
		// Invoke when user click to request another page.
		const handleSelect= async (event: React.ChangeEvent<{ value: unknown }>) => {
			var value = (event.target as any).value as ("userEmail" | "creationTime" |  "title");

			let prevOptions =this.state.options;
			this.setState((prev)=> ({ ...prev,
				options: {
					...prevOptions,
					sortBy: value
				}
			}));

		   const result = await api.getTickets({...this.state.options, sortBy: value ??  "creationTime" })
		   this.setState( (prev) =>  ({
			  ...prev ,ticketsResult: result
		   })
		   );
		  }

		return (
			<div>
				<h6 className='content'>Sort By</h6>
				<select className="form-select" aria-labelledby="dropdownMenuButton" onChange={handleSelect}  value={currentSort}>
					<option value="userEmail">Email</option>
					<option value="creationTime">Date</option>
					<option value="title">Title</option>				
				</select>
			</div>
		)
	}
	
	 paginatedItems = ( itemsPerPage: number, ticketsResult: TicketsResult, itemOffset: number ) => {
		const endOffset = itemOffset + itemsPerPage;
		console.log(`Loading items from ${itemOffset} to ${endOffset} count pages is ${ticketsResult.pages}`);
		const pageCount = ticketsResult.pages
	  
		// Invoke when user click to request another page.
		const handlePageClick = async (event: { selected: number; }) => {
		  const newOffset = (event.selected * itemsPerPage) % ticketsResult.total;
		  console.log(
			`User requested page number ${event.selected}, which is offset ${newOffset}`
		  );
		  this.setState( (prev) =>  ({
			...prev ,offset: newOffset
		 }));
		 const result = await api.getTickets({...this.state.options, page: event.selected + 1})
		 this.setState( (prev) =>  ({
			...prev ,ticketsResult: result
		 })
		 );
		}
	  
		return (
			<nav aria-label="Page navigation tickets" className="mt-4 ">

			<ReactPaginate
			  breakLabel="..."
			  nextLabel="next >"
			  onPageChange={handlePageClick}
			  pageRangeDisplayed={5}
			  pageCount={pageCount}
			  previousLabel="< previous"
			  forcePage={ticketsResult.page - 1}
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
	  }

	renderTickets = (tickets: Ticket[], favorite = false) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.options.search?.toLowerCase() ?? ''));

		const handleRemoveItem = (ticket: Ticket) => {
			return filteredTickets.filter(item => item.id !== ticket.id);
			};
		const handleAddItem = (ticket: Ticket) => {
			return [...this.state.favoriteTickes, ticket];
			};	
		const toggleFavorite = (ticket: Ticket) => {
			
		const favorites = favorite? handleRemoveItem(ticket): handleAddItem(ticket);
		console.log(favorite);
        console.log(favorites);
        this.setState((prev)=> ({...prev, favoriteTickes: favorites}))
		}	

		return (<ul className='tickets'>
			<TicketsComponent tickets={filteredTickets} favorite={favorite} handleToggle={(t)=>{toggleFavorite(t)}}/>
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);
        let prevOptions =this.state.options;
        this.setState((prev)=> ({ ...prev,
			options: {
				...prevOptions,
				search: val
			}
		}));
		this.searchDebounce = setTimeout(async () => {
			const tickets = await api.getTickets({...this.state.options,page: 1, search: this.state.options.search});
			this.setState( (prev)=> ({ ...prev,
				ticketsResult: tickets
			}));
		}, 300);
	}

	render() {	
		// const {tickets} = this.state;

		return (<>
			<h1>Tickets List</h1>
			<header>
				<input value={this.state.options.search}  type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>	
			</header>
			{this.sortItems(this.state.options.sortBy ?? "creationTime")}
			{this.state.ticketsResult ? <div className='results'>Showing {this.state.ticketsResult.data.length} / {this.state.ticketsResult.total} results</div> : null }	
			{this.state.ticketsResult ? this.renderTickets(this.state.ticketsResult.data) : <h2>Loading..</h2>}
			{this.state.ticketsResult && this.paginatedItems (this.state.ticketsResult.limit, this.state.ticketsResult, this.state.offset) }
            <h1>Favorites Tickets List</h1>
			{this.state.favoriteTickes.length > 0 ? this.renderTickets(this.state.favoriteTickes, true) : <h2>Add to favorites</h2>}

		</>)
	}
}

export default App;