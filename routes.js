const express = require('express');
const app = express.Router();
const cron = require('node-cron');

var menuItems = []; // Array to store menu items
var orders = []; // Array to store orders



app.post('/menu', (req, res) => {
    const { name, price, category } = req.body;
  
    // Validate inputs
    if (!name || price <= 0 || !['Appetizer', 'Main Course', 'Dessert', 'Beverage'].includes(category)) {
      return res.status(400).send({ error: 'Invalid input' });
    }
  
    const newItem = { id: menuItems.length + 1, name, price, category };
    menuItems.push(newItem);
    res.status(201).send(newItem);
  });

  app.get('/menu', (req, res) => {
    res.status(200).send(menuItems);
  });

  app.post('/orders', (req, res) => {
    const { items } = req.body;
  
    // Validate item IDs
    if (!items.every(itemId => menuItems.some(item => item.id === itemId))) {
      return res.status(400).send({ error: 'Invalid item IDs' });
    }
  
    const newOrder = { id: orders.length + 1, items, status: 'Preparing', timestamp: Date.now() };
    orders.push(newOrder);
    res.status(201).send(newOrder);
  });
  
  app.get('/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    res.status(200).send(order);
  });
  
  cron.schedule('*/1 * * * *', () => {
    orders.forEach(order => {
      if (order.status === 'Preparing') order.status = 'Out for Delivery';
      else if (order.status === 'Out for Delivery') order.status = 'Delivered';
    });
    console.log('Order statuses updated');
  });


module.exports = app;