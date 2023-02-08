import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket } from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});


app.get(APIPath, (req, res) => {

  const page: number = Number(req.query.page) || 1;
  const search = req.query.search?.toString() ?? "";
  const limit: number =  Number(req.query.limit) || PAGE_SIZE;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy?.toString() ?? "creationTime"

  const filterData = tempData.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase())).sort((a: Ticket, b: Ticket)=> (a[sortBy] > b[sortBy]? 1 : (a[sortBy] < b[sortBy]) ? -1 : 0));

  const total = filterData.length;
  const pages = Math.ceil(total / limit);

  if (page > pages) {
      return res.status(404).json({
          status: "fail",
          message: "No page found",
      });
  }
  const paginatedData = filterData.slice(skip, page * limit)

  res.json({
      status: "success",
      total: filterData.length,
      count: paginatedData.length,
      page,
      pages,
      limit,
      data: paginatedData
  });
 
  // res.send(paginatedData);
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

