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

var articles={
  'article_one': {
    title: "Article one | spider",
    content: `
          <p>
              Hello, welcome to first article of this page. Its been so long we have contacted each other. And this is not
              the way you can acheive the heights of success. You have to work smart. Everyone don't have same purpose in life.
              So, stop pushing others to work according to you.
          </p>
          <p>
              Hello, welcome to first article of this page. Its been so long we have contacted each other. And this is not
              the way you can acheive the heights of success. You have to work smart. Everyone don't have same purpose in life.
              So, stop pushing others to work according to you.
          </p>
          <p>
              Hello, welcome to first article of this page. Its been so long we have contacted each other. And this is not
              the way you can acheive the heights of success. You have to work smart. Everyone don't have same purpose in life.
              So, stop pushing others to work according to you.
          </p>
    `
  },
  'article_two': {
    title: "Article two | spider",
    content: `
          <p>
              Hello, welcome to second article of this page. Its been so long we have contacted each other. And this is not
              the way you can acheive the heights of success. You have to work smart. Everyone don't have same purpose in life.
              So, stop pushing others to work according to you.
          </p>

    `
  },
  'article_three':{
    title: "Article three | spider",
    content: `
          <p>
              Hello, welcome to three article of this page. Its been so long we have contacted each other. And this is not
              the way you can acheive the heights of success. You have to work smart. Everyone don't have same purpose in life.
              So, stop pushing others to work according to you.
          </p>

    `
  }
};

function createTemplate(data){
  title = data.title;
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

app.get('/:articlename', function (req, res) {
  var articlename = req.params.articlename;
  res.send(createTemplate(articles[articlename]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var pool = new Pool(config);

app.get('/test-db',function(req,res){
    pool.query('select * from test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringigy(result));
        }
    });
})


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
