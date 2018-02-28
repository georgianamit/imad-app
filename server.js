var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    Username:'georgianamitrawat',
    Database:'georgianamitrawat',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

 

function createTemplate(data){
  title = data.title;
  heading = data.heading;
  date = data.date;
  content = data.content;
  template = `
  <html>
  <head>
      <title>
          ${title}
      </title>
  </head>
  <body>
      <div class = "container">
        <div class="row">
            <a href="/">Home</a>|<a href="/articles/article-one">Article one</a>
            </hr>
            <p class="text-primary">${heading}</p>
            <p class="text-success">${date}</p>
        </div>
         
        <div class="row">
         ${content}
        </div>
      </div>
  </body>
</html>`;
return template;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

app.get('/test-db',function(req,res){
    pool.query('select * from test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/articles/:articlename', function (req, res) {
  
  pool.query("select * from article where title= $1",[req.params.articlename],function (err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
            if(result.rows.length === 0){
                res.status(500).send("Article not found.");
            }else{
                var articledata = result.rows[0];
                res.send(createTemplate(articledata));
            }
      }
  });

});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
