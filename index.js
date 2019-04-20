// import node module
const fs = require('fs');
const http = require('http');
const url = require('url');

// ใช้ method ไป read data เหมือนกับเป็น api อันนึง
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
// __dirname : current folder

// JSON to Object สมมติว่าเป็น database
const laptopData = JSON.parse(json);

// Create Server ดูว่ามี request และส่ง response
const server = http.createServer((req, res) => {
  // * TEST URL show property
  // console.log(url.parse(req.url, true));

  // Routing url เพื่อเรียกหน้า page เปลี่ยนไปตาม pathname
  const pathName = url.parse(req.url, true).pathname;

  // Query หรือดึงข้อมูลจาก database โดยใช้ url query
  const query = url.parse(req.url, true).query;
  const id = url.parse(req.url, true).query.id;

  // PRODUCT OVERVIEW
  if (pathName === '/products' || pathName === '/') {
    // http header บอกว่า data เป็นประเภทไหน (200,404)
    res.writeHead(200, { 'Content-type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      'utf-8',
      (err, data) => {
        // Send to html
        res.end(data);
      }
    );

    res.end('This is the PRODUCTS page!');
  }
  // LAPTOP DETAIL
  else if (pathName === '/laptop' && id < laptopData.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      'utf-8',
      (err, data) => {
        const laptop = laptopData[id];

        // Render HTML
        const output = replaceTemplate(data, laptop);

        // Send to html
        res.end(output);
      }
    );
  }
  // LAPTOP NOT FOUND
  else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('URL was not found on the server');
  }
});

// nodejs listen server + port ดูว่ามี request อะไรเข้ามาบ้าง
server.listen(1337, '127.0.0.1', () => {
  console.log('Listening for requests now');
});

function replaceTemplate(originalHTML, laptop) {
  let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName); // เอาข้อมูลจาก JSON ไป replace ตาม templates
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}
