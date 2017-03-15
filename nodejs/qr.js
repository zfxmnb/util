var express = require('express');
var http = require('http');
var https = require('https');
var router = express.Router();
var images= require('images');
var qr = require('qr-image');
var sizeOf = require('image-size');
/* GET users listing. */
router.get('/', function(req, res, next) {
	res.type('png'); 
	var text=req.query.text||"二维码信息为空",margin=req.query.margin||1,size=req.query.size||300,ec=req.query.ec||"M",src=req.query.src;
  	var qrcode = qr.imageSync(text,{type:"png",margin:Number(margin),ec_level:ec.toUpperCase()}); 
  	size=Number(size);
  	size=size<100?100:(size>800?800:size);
  	if(src){
  		var request=src.indexOf("https")==0?https:http;
	  	request.get(src, function(resp){
		    if (resp.statusCode == 200||resp.statusCode == 304){
		    	var imgData = "";
		    	resp.setEncoding("binary");
			    resp.on("data", function(chunk){
			        	imgData+=chunk;
			    });
			    resp.on("end", function(){
			    	if(Buffer.byteLength(imgData)<1024*100){
				    	var base64 = new Buffer(imgData, 'binary').toString('base64');
					    var img = new Buffer(base64, 'base64');
					    var imgSize=sizeOf(img);

					    var w=imgSize.width;
					    var h=imgSize.height;

					    var max=w>h?w:h;

					    if(max>size/4){
					    	w=w*(size/4)/max;
					    	h=h*(size/4)/max;
					    }

				        var data = images(qrcode)
				        .size(size)
				        .draw(images(img).size(w,h),(size-w)/2,(size-h)/2)
				        .encode("png");
					     res.send(data);
				    }else{
				    	send();
				    }
			    });
			}else{
				send();
			}
		}).on('error', function(err){
			send();
		});
	}else{
		send();
	} 
	function send(){
		var data = images(qrcode)
        .size(size)
        .encode("png");
		res.send(data);
	}
});

module.exports = router;
