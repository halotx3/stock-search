// Initial array of stocks
const stocks = ['WWE', 'AMD', 'TSLA', 'GOOGL'];
let validationList = [];

const coUrl = 'https://api.iextrading.com/1.0/ref-data/symbols'

$.ajax({
  url: coUrl,
  method: 'get'
}).then(function(response){
  // console.log(response)
  for(let i = 0; i < response.length; i++){
    validationList.push(response[i].symbol)
  }
  console.log(validationList)
})
// displaystockInfo function re-renders the HTML to display the appropriate content
const displayStockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=2y&last=10`;
  const logoURL =`https://api.iextrading.com/1.0/stock/${stock}/logo`;

  // Creating an AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {

    // Creating a div to hold the stock
    const stockDiv = $('<div>').addClass('stock');

    $.ajax({
      url: logoURL,
      method: 'GET'
    }).then(function(response){
      let lGo = response.url;
      console.log(lGo);
      const holLogo = $('<img>')
      holLogo.attr('src', `${lGo}`)
      stockDiv.prepend(holLogo)
    })

    // Storing the company name
    const companyName = response.quote.companyName;

    // Creating an element to display the company name
    const nameHolder = $('<p>').text(`Company Name: ${companyName}`);

    // Appending the name to our stockDiv
    stockDiv.append(nameHolder);

    // Storing the stock symbol
    //const stockSymbol = response.quote.symbol;

    // Creating an element to display the stock symbol
    //const symbolHolder = $('<p>').text(`Stock Symbol: ${stockSymbol}`);

    // Appending the symbol to our stockDiv
    //stockDiv.append(symbolHolder);

    // Storing the price
    const stockPrice = response.quote.latestPrice;

    // Creating an element to display the price
    const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);

    // Appending the price to our stockDiv
    stockDiv.append(priceHolder);


    //let summaryHolder = $('<p>')
    // Storing the first news summary
    // for(let i = 0; i < response.news[i].length; i++){
    //   console.log(response.news[i].summary);
    //   let coNew = response.news[i].summary;
    // const summaryHolder = $('<p>').text(`News Headline: ${coNew}`);

    //   stockDiv.append(`<p> News Headline: ${summaryHolder}</p>`);
    // };
   const companyNews = response.news[0].summary;
    // Creating an element to display the news summary
    const summaryHolder = $('<p>').text(`News Headline: ${companyNews}`);

    // Appending the summary to our stockDiv
   stockDiv.append(summaryHolder);

    // Finally adding the stockDiv to the DOM

    // Until this point nothing is actually displayed on our page
    $('.row').prepend(stockDiv);
    console.log(response);
  });

}

// Function for displaying stock data
const render = function () {

  // Deleting the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#buttons-view').empty();

  // Looping through the array of stocks
  for (let i = 0; i < stocks.length; i++) {

    // Then dynamically generating buttons for each stock in the array
    // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
    const newButton = $('<button>');
    
    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');
    
    // Adding a data-attribute
    newButton.attr('data-name', stocks[i]);
    
    // Providing the initial button text
    newButton.text(stocks[i]);
    
    // Adding the button to the buttons-view div
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
const addButton = function(event) {
  
  // event.preventDefault() prevents the form from trying to submit itself.
  // We're using a form so that the user can hit enter instead of clicking the button if they want
  event.preventDefault();

  // This line will grab the text from the input box
  const stock = $('#stock-input').val().trim().toUpperCase();
  
  if(validationList.includes(stock)){
      // The stock from the text box is then added to our array
    stocks.push(stock);

  // Deletes the contents of the input
    $('#stock-input').val('');

  // calling render which handles the processing of our stock array
    render();
  }

}

// Even listener for #add-stock button
$('#add-stock').on('click', addButton);

// Adding a click event listener to all elements with a class of 'stock-btn'
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);

// Calling the renderButtons function to display the initial buttons
render();