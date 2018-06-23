const actions = [
    {'date': '1992/07/14 11:12:30', 'action': 'BUY', 'price': '12.3', 'ticker': 'AAPL', 'shares': '500'},
    {'date': '1992/09/13 11:15:20', 'action': 'SELL', 'price': '15.3', 'ticker': 'AAPL', 'shares': '100'},
    {'date': '1992/10/14 15:14:20', 'action': 'BUY', 'price': '20', 'ticker': 'MSFT', 'shares': '300'}, 
    {'date': '1992/10/17 16:14:30', 'action': 'SELL', 'price': '20.2', 'ticker': 'MSFT', 'shares': '200'}, 
    {'date': '1992/10/19 15:14:20', 'action': 'BUY', 'price': '21', 'ticker': 'MSFT', 'shares': '500'}, 
    {'date': '1992/10/23 16:14:30', 'action': 'SELL', 'price': '18.2', 'ticker': 'MSFT', 'shares': '600'}, 
    {'date': '1992/10/25 10:15:20', 'action': 'SELL', 'price': '20.3', 'ticker': 'AAPL', 'shares': '300'}, 
    {'date': '1992/10/25 16:12:10', 'action': 'BUY', 'price': '18.3', 'ticker': 'MSFT', 'shares': '500'}
  ];
  
  const stock_actions = [
    {'date': '1992/08/14', 'dividend': '0.10', 'split': '', 'stock': 'AAPL'}, 
    {'date': '1992/09/01', 'dividend': '', 'split': '3', 'stock': 'AAPL'}, 
    {'date': '1992/10/15', 'dividend': '0.20', 'split': '', 'stock': 'MSFT'},
    {'date': '1992/10/16', 'dividend': '0.20', 'split': '', 'stock': 'ABC'}
  ];
  
  // Combined both arrays and sorted by date and timestamp
  const complete = actions.concat(stock_actions).sort((a,b) => {
    return Date.parse(a.date) - Date.parse(b.date);
  });
  
  // created empty portfolio object to place our stocks in
  const portfolio = {};
  
  //dividend income
  let dividendIncome = 0;
  
  //summary function that outputs the contents our portfolio
  function summary(portfolio, date,) {
    console.log(`On ${date}, you have:`)
    for (let ticker in portfolio) {
      let stock = portfolio[ticker];
      stock.price = parseFloat(stock.price).toFixed(2);
      //will only execute if we have shares of the stock
      if (stock.shares !== 0) {
      console.log(` - ${stock.shares} shares of ${ticker} at $${stock.price} per share`);
      }
    }
    console.log(` - $${parseFloat(dividendIncome).toFixed(2)} of dividend income`);
  }
  
  // function that lists all the transactions for the day
  function transactions(element, portfolio) {
  
    //converting strings to numbers
    element.shares = parseFloat(element.shares);
    element.price = parseFloat(element.price).toFixed(2);
    console.log('Transactions:')
    // if we bought stock
    if (element.action === 'BUY') {
      console.log(` - You bought ${element.shares} of ${element.ticker} at a price of $${element.price} per share`);
      // if we sold stock
    } else if (element.action === 'SELL') {
      let profit = (element.shares * element.price) - (element.shares * parseFloat(portfolio[element.ticker].price).toFixed(2));
        
      //message depending on a loss or profit
        if (profit >= 0) {
          console.log(` - You sold ${element.shares} shares of ${element.ticker} at a price of $${element.price} for a profit of $${parseFloat(profit).toFixed(2)}`);
        } else {
          console.log(` - You sold ${element.shares} shares of ${element.ticker} at a price of $${element.price} for a loss of $${parseFloat(profit).toFixed(2)}`);
        }
  
    } else if (element.split !== '' && portfolio[element.stock]) {
      // if there is a stock split
        console.log(` - ${element.stock} split ${element.split} to 1, and you have ${portfolio[element.stock].shares} shares `)
    } else if (element.dividend !== '' && portfolio[element.stock]) {
      //if there is a divedent payout
      console.log(` - ${element.stock} paid out $${element.dividend} dividend per share, and you have ${portfolio[element.stock].shares} shares`)
    }
  }
  
  
  //Main function. Goes through each element of the array
  function statement(arr) {
    arr.forEach((element, i) => {
      //removed timestamp from the date
      element.date = element.date.split(' ')[0];
      element.price = parseFloat(element.price).toFixed(2);
      if (element.action === 'BUY') {
        //if we bought stock we pereviously did not own, then it creates and add an entry to the porfolio object
        if(!portfolio[element.ticker]) {
          portfolio[element.ticker] =  {
            'price': 0,
            'shares': 0
          }
        }
  
       //calculating price, more specifically the weighted average
       let previousPrice = portfolio[element.ticker].price;
       let previousShares = portfolio[element.ticker].shares;
       portfolio[element.ticker].shares += parseFloat(element.shares);
       portfolio[element.ticker].price = ( (parseFloat(element.shares) * element.price) /  portfolio[element.ticker].shares ) + ((previousPrice * previousShares )/ portfolio[element.ticker].shares);
  
       // if we sold stock we have to caculate new shares quantity
      } else if (element.action === 'SELL') {
        portfolio[element.ticker].shares -= parseFloat(element.shares);
         
        // if the stock split we have to caculate new shares quantity and price
      } else if (element.split !== '' && portfolio[element.stock]) {
        portfolio[element.stock].shares *= parseFloat(element.split);
        portfolio[element.stock].price /=  parseFloat(element.split);
  
        // if there is a dividend to be paid and we own it, then update the dididend income total
      } else if (element.dividend !== '' && portfolio[element.stock]) {
        dividendIncome += portfolio[element.stock].shares * element.dividend;
  
      }
      //run functions only if we own shares of the stocks
      if (portfolio[element.ticker] || portfolio[element.stock]) {
        summary(portfolio, element.date);
        transactions(element, portfolio);
      }
    });
  }
  
  //run statement generator function
  statement(complete);