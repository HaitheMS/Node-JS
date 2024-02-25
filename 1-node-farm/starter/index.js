// Using the built-in module file system
const fs = require('fs'); // https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// Using HTTP built-in module
const http = require('http'); // https://www.w3schools.com/nodejs/nodejs_http.asp
// Using the url built-in module
const url = require('url'); // https://www.w3schools.com/nodejs/nodejs_url.asp
// Using 3rd party library Slugify
const slugify = require('slugify'); // https://www.npmjs.com/package/slugify

// Importing (Using) Custom module
const templateBuilder = require('./hbaModules/templateBuilder');

// Using slugify to get familiar with the 3rd party library
const myName = 'Haïthem BEN AYOUB😎';
console.log(
    slugify(myName, {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
    })
);

////////////////////=/////////////SYNCHRONOUS WAY OF DOING THE FOLLOWING /////////////////////////////////////////=////
/** 1st Block: This code block has to be understood alone.
// Read file in the system "SYNC"
const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textInput);

// "Transform text from a text read from a file."
const textoOutput = `The content present in the file is: ✍\n${textInput}.\n\nIt has been read for the last time, on ⏲: ${new Date().toLocaleString()}\nCreated by ${myName}😉`;
console.log(textoOutput);

// Create a file in the system using file system module "SYNC"
fs.writeFileSync("./txt/OutputUsingWriteSync.txt", textoOutput);
console.log("File written 👏 !");
 
 1st Block: END*/
//////////////////=/////////////ASYNCHRONOUS WAY OF DOING THE SAME (Better for Production, Non blocking)//////////=///////
/** 2nd Block: This code block has to be understood alone.
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err)
    return console.error(
      "There was an ERROR while reading the start file! 💥",
      err
    );

  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    if (err)
      return console.error(
        "There was an ERROR while reading the second file! 💥",
        err
      );
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      if (err)
        return console.error(
          "There was an ERROR while reading the append file! 💥",
          err
        );
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        if (err)
          return console.error(
            "There was an ERROR while writing the final file! 💥",
            err
          );
        console.log("Your file has been written 😁");
      });
    });
  });
});
console.log(
  "This log the console proves that this line will be executed before the previous bloc (using callback function) even it has been written after!"
);
 2nd Block: END*/
///** 3rd Block: This code block has to be understood alone.
///////////////////////////////////CREATING A WEB SERVER/////////////////////

//////////////////////TOP LEVEL CODE that runs once the SERVER is loaded/////////////////////
/////////////////////ASSETS START /////////////////////

// Fetching HTML assets
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

// Fetch API DATA
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObjects = JSON.parse(data);
/////////////////////ASSETS END /////////////////////
/////////////////////Creating SERVER /////////////////////
// Using the Built-in http module we can create a web server that can recieve Requests, and send Responses
const server = http.createServer((req, res) => {
    // Callback function
    const { query, pathname } = url.parse(req.url, true);
    console.log(url.parse(req.url, true));
    console.log(query, pathname);

    /////////////////////ROUTING/////////////////////
    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        // Loading Cards
        const cardsHtml = dataObjects.map((el) => templateBuilder(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.writeHead(200, {
            // Adding Response Header
            'Content-Type': 'text/html',
        });
        res.end(output);
    }
    // Product page
    else if (pathname === '/product') {
        // Retrieving the product from the data using the query parameter
        const product = dataObjects[query.id];
        const output = templateBuilder(tempProduct, product);
        res.writeHead(200, {
            // Adding Response Header
            'Content-Type': 'text/html',
        });
        res.end(output);
    }
    /////////////////////BUILDING A SIMPLE API START/////////////////////
    else if (pathname === '/api') {
        // Serving Data from Fetched API DATA at the top level
        res.writeHead(202, {
            // Adding Response Header
            'Content-Type': 'application/json',
        });
        // Serving Data
        res.end(data);
    } else {
        // Page not found
        // Defining Request's Header using writeHead
        res.writeHead(404, {
            'Content-Type': 'text/html',
            myCustomHeaderProperty: 'MyCustomValue',
            message: 'Page does not exist',
        }); // Open dev tools and read the console showing: "Failed to load resource: the server responded with a status of 404 (Not Found)"
        res.end('<h1>Page not found, 404 page!</h1>');
    }
});
/////////////////////ROUTING END /////////////////////
// Setup the Server listener
server.listen(15100, '127.0.0.1', () => {
    // Server listener callback function
    console.log('Server is running and waiting for requests 📌👏');
});

// at this step go and access to http://127.0.0.1:15100/ to read the "Hello from our magical Server" sentence and verify that the console shows up the req object (a HUGE object)
// 3rd Block: END*/
