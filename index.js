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
  console.log(pathName);

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
        let overviewOutput = data;
        // Create Card
        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          'utf-8',
          (err, data) => {
            // loop by laptopdata ได้ array ใหม่ แล้วไปสร้าง card
            const cardsOutput = laptopData
              .map(el => replaceTemplate(data, el))
              .join('');

            // render template
            overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);

            // Send to html
            res.end(overviewOutput);
          }
        );
      }
    );
  }
  // LAPTOP DETAIL
  else if (pathName === '/laptop' && id < laptopData.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      'utf-8',
      (err, data) => {
        // data มาจาก templates {% . . . %} แล้ว replace ด้วยข้อมูล JSON file
        const laptop = laptopData[id];

        // Render HTML
        const output = replaceTemplate(data, laptop);

        // Send to html
        res.end(output);
      }
    );
  }
  // IMAGES ต้องให้เป็น response data เพราะ node ออกแบบมาให้ request response ไม่ใช่เป็น direction folder
  else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    // ReqEx เช็คว่า match กับ pathname มั้ย
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { 'Content-type': 'image/jpg' });
      res.end(data);
    });
    // pathName ของ img /huawei-matebook-pro.jpg
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
  // รูปจะยังไม่แสดงเพราะว่า nodejs ต้องการ request กับ response
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}
