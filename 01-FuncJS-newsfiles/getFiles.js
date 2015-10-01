var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var charset = require('charset');
var iconv = require('iconv');
var path = require('path')

var news = JSON.parse(fs.readFileSync('./json/news.json'));
var media = {
  veinticuatroHoras : '24 Horas',
  laTercera : 'La Tercera',
  emol : 'Emol',
  cooperativa : 'Cooperativa',
  bioBio : 'BioBio',
  laSegunda : 'La Segunda'
};

// var selectedNumbers = [0, 2, 5, 6, 8, 65, 13];
// var selectedNews = [];
//
// selectedNumbers.forEach(function(item) {
//   selectedNews.push(news[item]);
// });




var parseNews = function(news, callback) {
    request({url: news.url, encoding: null}, function(error, response, body) {
      if (error) {
        throw error;
      }
      var docCharset = charset(response.headers);
      var cleanBody;
      if(docCharset == 'iso-8859-1' || news.media === media.emol || news.media === media.laTercera)  {
        var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
        var buf = ic.convert(body);
        cleanBody = buf.toString('utf-8');
      } else {
        cleanBody = body;
      }
      var $ = cheerio.load(cleanBody);
      var title;
      var lead = '';
      var content = '';

      switch (news.media) {
        case media.veinticuatroHoras:
          title = $('#TituloSArtID').text();
          lead = $('.BajadaSArt').text();

          $('.box-main script').remove();
          $('.box-main p').each(function(index, el) {
            content = content + $(el).text() + '\n';
          });
          break;
        case media.laTercera:
          title = $('.titularArticulo').text();
          lead = $('.bajadaArt').text();
          $('.articleContent p').each(function(index, el) {
            content = content + $(el).text() + '\n';
          });
          break;
        case media.emol:
          title = $('#cont_iz_titulobajada h1').text();
          lead = $('#cont_iz_titulobajada h2').text();
          $('#texto_noticia .EmolText p').each(function(index, el) {
            content = content + $(el).text() + '\n';
          });
          if (content.length === 0) {
            content = $('#texto_noticia .EmolText').text();
          }
          break;
        case media.cooperativa:

          var isArticle = $('#articulo').length > 0;
          if(isArticle) {
            title = $('#articulo header h3').text();
            $('#articulo header div p').each(function(index, el) {
              lead = lead + $(el).text() + '\n';
            });
            $('#articulo .contenido .CUERPO p').each(function(index, el) {
              content = content + $(el).text() + '\n';
            });
          } else {
            $('#multimedia .titular span').remove();
            title = $('#multimedia .titular').text();
            lead = $('#multimedia h2+h3').text();
            content = '';
          }
          break;
        case media.laSegunda:
          title = $('.titulo h1').text();
          lead = $('.titulo h2').text();
          $('#texto03 #contIzquierdoTexto03, #texto03 script, #texto03 style').remove();
          $('#texto03 div').each(function(index, el) {
            content = content + $(el).text() + '\n';
          });

          content = content.trim();

          if(content.length === 0) {
            content = $('#texto03').text();
          }

          break;
        case media.bioBio:

          title = $('#titulo-nota').text();
          lead = '';
          $('#contenido-nota p').each(function(index, el) {
            content = content + $(el).text() + '\n';
          });
          break;

        default:
          throw 'Unknown media: '+news.media;
      }

      if(title) {
        fs.writeFile(path.join(__dirname, 'newsfiles/')+news.id+'.txt', [title,lead,content].join('\n'), function(err) {
          if(err) {
            throw err;
          }

          callback();
        });
      } else {
        callback();
      }

    });
};


var queue = async.queue(parseNews, 10);
queue.drain = function() {
  console.log("All files generated");
};

news.forEach(function(news) {
  queue.push(news, function(err) {
    if (err) {
      throw err;
    }

    console.log('News '+news.id+' has been written');
  });
});
