var fs = require('fs');
var accounts = require('./accounts.json').map((a)=>{return a.account_id});
// var file = require('./coop.html');
var aws = require('aws-sdk'),
	s3 = new aws.S3();
 var template = `<!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="utf-8" />
     <title>DealerX Responsive Banner Used Cars</title>
     <meta title="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
     <meta title="displayheight" content="31, 60, 90, 125, 250, 400, 600" />
     <link rel="stylesheet" href="https://cdn.dealerx.com/assets/portals/css/bootstrap_formultiple.min.css" />
     <link rel="stylesheet" href="https://cdn.dealerx.com/assets/portals/css/dr_creative_used.min.css" />
     <link href="https://fonts.googleapis.com/css?family=Rajdhani:300,400,500,600,700" rel="stylesheet">
 </head>
 <body>
     <div class="banner">
         <div class="header" style="background-color:{setup_ad_header_color}">
             <div class="aLogo">
                 <img src="https://cdn.dealerx.com/advertiser_logos/{setup_roiq_id}.png">
             </div>
         </div>
         <div class="vd">
         </div>
         <div class="vehicle_gallery">
         </div>
     </div>
   </body>
   <script>
         var BTTN_COLOR = "{setup_ad_header_color}";
     </script>
     <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
     <script src="https://cdn.dealerx.com/assets/element-assets/js/dynamic_used.js" account_id="{setup_roiq_id}" type="text/javascript"></script>
     <script id="packetjs" src="https://cdn.dealerx.com/creatives/js/packet.js"></script>
 </html>`;

console.log('template', template)
  // read the template;
  var uploadParams = {
		Bucket: 'cdn.wpdlr.co',
		Key: 'testKey',
		Body: 'test my key',
		ContentType: 'text/html',
		ACL: 'public-read'
	};

var start =1;
var end = accounts.length;
// var end = 1;

// var run = setInterval(()=>{
//    var current_id = accounts[start];
//    console.log('current_id', current_id,'working for', start, end)
//     uploadParams.Body = template.replace('{setup_roiq_id}',current_id).replace('{setup_roiq_id}',current_id );
//    uploadParams.Key = 'creatives/' +current_id + '/' + 'Dynamic_Used_Targeting_used_vehicles.html'
//    console.log(uploadParams);
//    s3.upload(uploadParams, function(err, data) {
//      //  console.log('line 184', data)
//      if (err) {
//        console.log("Error", err);
//      } else if (data) {
//        console.log("Upload Success", data.Location);
//      }
//    });
//
//
//    start++;
//    if(start==end){
//      clearInterval(run);
//    }
//
// }, 1000)
