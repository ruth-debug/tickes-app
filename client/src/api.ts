import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';
import { type } from 'os';

export type TicketsResult = {
    data: Ticket[],
    total: number,
    limit: number,
    status: string,
    count: number,
    page: number,
    pages: number,
}

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}


export interface FilterProps {
    search?: string;
    page?: number;
    limit?: number;
    before?: number;
    after?: number;
    from?: string;
    sortBy?: "userEmail" | "creationTime" |  "title";
}

export type ApiClient = {
    getTickets: (filter?: FilterProps) => Promise<TicketsResult>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (filter?: FilterProps) => {
            return axios.get(APIRootPath, { params: filter }).then((res) => res.data);
        }
    }
}
