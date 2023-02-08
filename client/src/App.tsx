import React, {useEffect, useState} from 'react';
import './App.scss';
import {createApiClient, FilterProps, Ticket, TicketsResult} from './api';
import ReactPaginate from 'react-paginate';
import TicketsComponent from './components/TicketComponent';
import SortComponent from './components/SortComponent';
import PaginateComponent from './components/PaginateComponeent';
export type AppState = {
    offset: number,
	ticketsResult?: TicketsResult,
	options: FilterProps,
	favoriteTickes: Ticket[]
}

const api = createApiClient();
export class App extends React.PureComponent<{},AppState> {
    
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

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.setState((prev)=> ({ ...prev,
			options: {
				...prev.options,
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
		const handleSelect= async ( val: string ) => {
			var value = val as ("userEmail" | "creationTime" |  "title");
			this.setState((prev)=> ({ ...prev,
				options: {
					...prev.options,
					sortBy: value
				}
			}));

		   const result = await api.getTickets({...this.state.options, sortBy: value ??  "creationTime" })
		   this.setState( (prev) =>  ({
			  ...prev ,ticketsResult: result
		   })
		   );
		  }
		
		// Invoke when user click to request another page.
		const handlePageClick = async (event: { selected: number; }) => {
			const newOffset = (event.selected * (this.state.ticketsResult?.limit ?? 0)) % (this.state.ticketsResult?.total ?? 1);
			this.setState( (prev) =>  ({
			  ...prev ,offset: newOffset
		   }));
		   const result = await api.getTickets({...this.state.options, page: event.selected + 1})
		   this.setState( (prev) =>  ({
			  ...prev ,ticketsResult: result
		   })
		   );
		  }  

		const handleRemoveItem = (ticket: Ticket) => {
			return this.state.favoriteTickes.filter(item => item.id !== ticket.id);
			};
		const handleAddItem = (ticket: Ticket) => {
			return [ ticket, ...handleRemoveItem(ticket)];
			};	
		const toggleFavorite = (ticket: Ticket, favorite: boolean = false) => {
			
		const favorites = favorite? handleRemoveItem(ticket): handleAddItem(ticket);
		this.setState((prev)=> ({...prev, favoriteTickes: favorites}))
		}	

		return (<>
			<h1>Tickets List</h1>
			<header>
				<input value={this.state.options.search}  type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>	
			</header>
			<SortComponent sortBy={this.state.options.sortBy} handleSortChange={handleSelect}   />
			{this.state.ticketsResult ? <div className='results'>Showing {this.state.ticketsResult.data.length} / {this.state.ticketsResult.total} results</div> : null }	
			{this.state.ticketsResult ? 
			<TicketsComponent tickets={this.state.ticketsResult.data} favorite={false} handleToggle={(t)=>{toggleFavorite(t)}}/> : <h2>Loading..</h2>}
			
			{this.state.ticketsResult && <PaginateComponent ticketsResult={this.state.ticketsResult} handlePaginateChange={handlePageClick}/> }
            <h1>Favorites Tickets List</h1>
			{this.state.favoriteTickes.length ?<TicketsComponent tickets={this.state.favoriteTickes} favorite={true} handleToggle={(t)=>{toggleFavorite(t,true)}}/>  : <h2>Add to favorites</h2>}

		</>)
	}
}

export default App;