var fs = require('fs');
// var accounts = require('./accounts.json').filter((ad)=>{
// 	return ad.primary_make.indexOf("Honda") >  -1 || ad.primary_make.indexOf("Kia") >  -1 || ad.primary_make.indexOf("Toyota") >  -1 || ad.primary_make.indexOf("Nissan") >  -1 || ad.primary_make.indexOf("Jeep") >  -1 || ad.primary_make.indexOf("GMC") > -1 || ad.primary_make.indexOf("Infiniti") > -1 || ad.primary_make.indexOf("Subaru") > -1 || ad.primary_make.indexOf("GMC") > -1
// }).map((a)=>{return { account_id: a.account_id, primary_make: a.primary_make}});
var accounts = require('./accounts.json');
// var file = require('./coop.html');
var aws = require('aws-sdk'),
	s3 = new aws.S3();
	// {setup_roiq_id}
 var template = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <title>Dynamic new</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="displayheight" content="31, 60, 90, 125, 250, 400, 600">
  <meta name="robots" content="noindex, nofollow" />
  <link href="https://fonts.googleapis.com/css?family=Fjalla+One|Open+Sans:300,400,800" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="https://cdn.dealerx.com/assets/bootstrap/vendor/owl-carousel/owl.carousel.css">
  <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://cdn.dealerx.com/assets/element-css/v1/v1.css">
  <link rel="stylesheet" href="https://cdn.dealerx.com/assets/element-css/v1/dynamic_template_custom.css">
  <link rel="stylesheet" href="https://cdn.dealerx.com/assets/fonts/nissan/fonts.css">
  <link rel="stylesheet" href="https://cdn.dealerx.com/assets/fonts/infiniti/infiniti.css">
  <link rel="stylesheet" href="https://cdn.dealerx.com/assets/element-assets/css/coop/coop.css">
  </head>
  <body>
  </body>
  <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
  <script id="packetjs" src="https://cdn.dealerx.com/creatives/js/packet.js"></script>
  <script src="https://cdn.dealerx.com/assets/bootstrap/vendor/owl-carousel/owl.carousel.min.js"></script>
  <script src="https://cdn.dealerx.com/creatives/{setup_roiq_id}/model-specials/specials.js"></script>
  <script>
	var options = {
      price: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Now for </div><div class="amount"><sup>$</sup>{{price}}</div>{{ADDITIONAL}}</div>',
      payment_t1: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>{{payment_t1}}<span>/mo</span>{{ADDITIONAL}}</div></div>',
      payment_t1_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>{{payment_t1}}<span>/mo</span></div><div  class="note">Offer Expires on {{finance_expiration}}</div>{{ADDITIONAL}}</div>',
      payment_t2: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>{{payment_t2}}<span>/mo</span>{{ADDITIONAL}}</div></div>',
      payment_t2_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>"{{payment_t2}}"<span>/mo</span></div><div class="note">Offer Expires on {{lease_expiration}} {{ADDITIONAL}}</div></div>',
      lease_payment: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Lease For</div><div class="amount"><sup>$</sup>{{lease_payment}}<span>/mo</span>{{ADDITIONAL}}</div></div>',
      lease_payment_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Lease For</div><div class="amount"><sup>$</sup>{{lease_payment}}<span>/mo</span></div><div  class="note"><div id="term">for {{lease_term}} months. <span id="downpayment">$ {{downpayment}}</span> due at lease signing.</div> <div><i>Excludes tax, title and fees</i></div><div>Offer Expires on {{lease_expiration}}</div>{{ADDITIONAL}}</div></div>',
      lease_payment_expires_vin: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Lease For</div><div class="amount"><sup>$</sup>{{lease_payment}}<span>/mo</span></div><div  class="note"><div id="term">for {{lease_term}} months. <span id="downpayment">$ {{downpayment}}</span> due at lease signing.</div> <div><i>Excludes tax, title and fees</i></div><div>Offer Expires on {{lease_expiration}}</div><div>Sales Price:$ {{lease_sales_price}} Vin:{{vin}} </div>{{ADDITIONAL}}</div></div>',
      interest_rate: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type"> </div><div class="amount" id="interest_rate">{{interest_rate}}<sup>%</sup></div><div class="terms1">APR Financing</div><div  class="note">up to {{term}} months. {{ADDITIONAL}}</div></div>',
      interest_rate_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type"> </div><div class="amount"  id="interest_rate">{{interest_rate}}<sup>%</sup></div><div class="terms1">APR Financing</div><div  class="note">up to {{term}} months. </br>Offer Expires on {{finance_expiration}} {{ADDITIONAL}}</div></div>',
      rebate_name_1: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_1}}</div><div class="amount"><sup>$</sup>{{rebate_amount_1}} {{ADDITIONAL}}</div></div>',
      rebate_name_2: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_2}}</div><div class="amount"><sup>$</sup>{{rebate_amount_2}} {{ADDITIONAL}}</div></div>',
      rebate_name_3: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_3}}</div><div class="amount"><sup>$</sup>{{rebate_amount_3}}{{ADDITIONAL}}</div></div>',
      rebate_name_4: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_4}}</div><div class="amount"><sup>$</sup>{{rebate_amount_4}}{{ADDITIONAL}}</div></div>',
      custom_img_300x110 : '<div class="offer"><div id="custom_img"><img src="{{image_url}}"></div></div>',
      template: '<a href="{{url}}" target="_blank"><div class="banner"><div class="header" style="background:#fff"></div></div><div class="title"><span class="year"></span> <strong>{{make}}</strong> <span class="model">{{model}}</span></div><div class="vehicle" contenteditable="false"> <img src="https://fuel.dealerx.com/stills/{{EVOX_ID}}/{{EVOX_ID}}_st0640_090.png" alt="Vehicle"></div><div class="vehicle1" contenteditable="false"> <img src="https://fuel.dealerx.com/stills/{{EVOX_ID}}/{{EVOX_ID}}_st0640_121.png" alt="Vehicle"></div><div class="vehicle2" contenteditable="false"> <img src="https://fuel.dealerx.com/stills/{{EVOX_ID}}/{{EVOX_ID}}_st0640_037.png" alt="Vehicle"></div><div class="details"> <div id="offers">{{OFFERS}} </div></div><div class="footer" style="background:{setup_ad_footer_color}"></div><div id="id" style="background:{{setup_ad_logobackground_color}}"><img src="https://cdn.dealerx.com/advertiser_logos/{setup_roiq_id}.png"/></div><div><div class="cta" style="background:{setup_ad_button_bg_color}"><span>Get Yours Now</span></div></a><div class="disclaimer">Terms & Conditions Apply, Read The Full Disclaimer <strong onclick="toggledisc()">Here</strong></div><div class="term_details" style="display: none;"><strong class="close" onclick="toggledisc()">X</strong>Finance Disclaimer:{{finance_disclosure}}</div></div></div>'
    };
  </script>
  <script src="https://cdn.dealerx.com/assets/element-assets/js/coop/coop.js"  account_id="{setup_roiq_id}"></script>
  </html>`;

 var template_reg = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Dynamic new</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="displayheight" content="31, 60, 90, 125, 250, 400, 600">
<meta name="robots" content="noindex, nofollow" />
<link href="https://fonts.googleapis.com/css?family=Fjalla+One|Open+Sans:300,400,800" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="https://cdn.dealerx.com/assets/bootstrap/vendor/owl-carousel/owl.carousel.css">
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.dealerx.com/assets/element-css/v1/v1.css">
<link rel="stylesheet" href="https://cdn.dealerx.com/assets/element-css/v1/dynamic_template_custom.css">
</head>
<body>
</body>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script id="packetjs" src="https://cdn.dealerx.com/creatives/js/packet.js"></script>
<script src="https://cdn.dealerx.com/assets/bootstrap/vendor/owl-carousel/owl.carousel.min.js"></script>
<script src="https://cdn.dealerx.com/creatives/{setup_roiq_id}/model-specials/specials.js"></script>
<script>
var options = {
		price: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Now for </div><div class="amount"><sup>$</sup>{{price}}</div>{{ADDITIONAL}}</div>',
		payment_t1: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>{{payment_t1}}<span>/mo</span></div>{{ADDITIONAL}}</div>',
		payment_t1_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>{{payment_t1}}<span>/mo</span></div><div  class="note">Offer Expires on {{finance_expiration}}</div>{{ADDITIONAL}}</div>',
		payment_t2: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>{{payment_t2}}<span>/mo</span></div>{{ADDITIONAL}}</div>',
		payment_t2_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Finance For</div><div class="amount"><sup>$</sup>"{{payment_t2}}"<span>/mo</span></div><div class="note">Offer Expires on {{lease_expiration}}</div>{{ADDITIONAL}}</div>',
		lease_payment: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Lease For</div><div class="amount"><sup>$</sup>{{lease_payment}}<span>/mo</span></div>{{ADDITIONAL}}</div>',
		lease_payment_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">Lease For</div><div class="amount"><sup>$</sup>{{lease_payment}}<span>/mo</span></div><div  class="note"><div id="term">for {{term}} months. <span id="downpayment">$ {{downpayment}}</span> due at lease signing.</div> <div><i>Excludes tax, title and fees</i></div><div>Offer Expires on {{lease_expiration}}</div><div>{{ADDITIONAL}}</div></div>',
		interest_rate: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type"> </div><div class="amount" id="interest_rate">{{interest_rate}}<sup>%</sup></div><div class="terms1">APR Financing</div><div  class="note">up to {{interest_term}} months.</div>{{ADDITIONAL}}</div>',
		interest_rate_expires: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type"> </div><div class="amount"  id="interest_rate">{{interest_rate}}<sup>%</sup></div><div class="terms1">APR Financing</div><div  class="note">up to {{interest_term}} months. </br>Offer Expires on {{finance_expiration}}</div>{{ADDITIONAL}}</div>',
		rebate_name_1: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_1}}</div><div class="amount"><sup>$</sup>{{rebate_amount_1}}</div>{{ADDITIONAL}}</div>',
		rebate_name_2: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_2}}</div><div class="amount"><sup>$</sup>{{rebate_amount_2}}</div>{{ADDITIONAL}}</div>',
		rebate_name_3: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_3}}</div><div class="amount"><sup>$</sup>{{rebate_amount_3}}</div>{{ADDITIONAL}}</div>',
		rebate_name_4: '<div class="offer"><div id="veh"><strong> {{year}} {{make}} {{model}} {{trim}} </strong></div><div class="type">{{rebate_name_4}}</div><div class="amount"><sup>$</sup>{{rebate_amount_4}}</div>{{ADDITIONAL}}</div>',
		custom_img_300x110 : '<div class="offer"><div id="custom_img"><img src="{{image_url}}"></div>{{ADDITIONAL}}</div>',
		template: '<a href="{{url}}" target="_blank"><div class="banner"><div class="header" style="background:#fff"></div></div><div class="title"><span class="year"></span> <strong>{{make}}</strong> <span class="model">{{model}}</span></div><div class="vehicle" contenteditable="false"> <img src="https://fuel.dealerx.com/stills/{{EVOX_ID}}/{{EVOX_ID}}_st0640_090.png" alt="Vehicle"></div><div class="vehicle1" contenteditable="false"> <img src="https://fuel.dealerx.com/stills/{{EVOX_ID}}/{{EVOX_ID}}_st0640_121.png" alt="Vehicle"></div><div class="vehicle2" contenteditable="false"> <img src="https://fuel.dealerx.com/stills/{{EVOX_ID}}/{{EVOX_ID}}_st0640_037.png" alt="Vehicle"></div><div class="details"> <div id="offers">{{OFFERS}} </div></div><div class="footer" style="background:{setup_ad_footer_color}"></div><div id="id" style="background:{{setup_ad_logobackground_color}}"><img src="https://cdn.dealerx.com/advertiser_logos/{setup_roiq_id}.png"/></div><div><div class="cta" style="background:{setup_ad_button_bg_color}"><span>Get Yours Now</span></div></a><div class="disclaimer">Terms & Conditions Apply, Read The Full Disclaimer <strong onclick="toggledisc()">Here</strong></div><div class="term_details" style="display: none;"><strong class="close" onclick="toggledisc()">X</strong>Finance Disclaimer:{{finance_disclosure}}</div></div></div>'
};
</script>
    <script src="https://cdn.dealerx.com/assets/element-css/v1/dynamic_new_custom.js" account_id="{setup_roiq_id}"></script>
</html>`
  // read the template;
  var uploadParams = {
		Bucket: 'cdn.wpdlr.co',
		Key: 'testKey',
		Body: 'test my key',
		ContentType: 'text/html',
		ACL: 'public-read'
	};

var start =0;
var end = accounts.length;
// var end = 1;

var run = setInterval(()=>{
   var current_id = accounts[start].account_id;
	 console.log('working for', start, end, current_id)
	 // we ignore ford; BMW; mini; Cadillac;Chevrolet;Mitsubishi;Acura; Volkswagen;  Hyundai (??)
	 if(accounts[start].primary_make.indexOf("Honda") >  -1 || accounts[start].primary_make.indexOf("Kia") >  -1 || accounts[start].primary_make.indexOf("Toyota") >  -1 || accounts[start].primary_make.indexOf("Nissan") >  -1 || accounts[start].primary_make.indexOf("Jeep") >  -1 || accounts[start].primary_make.indexOf("GMC") > -1 || accounts[start].primary_make.indexOf("Infiniti") > -1 || accounts[start].primary_make.indexOf("Subaru") > -1 || accounts[start].primary_make.indexOf("GMC") > -1 ||  accounts[start].primary_make.indexOf("Audi") > -1){
		 template = template.replace('{setup_ad_header_color}','#fff');

		 // if(accounts[start].primary_make.indexOf("Nissan") >  -1 ){
			//  	template = template.replace('{setup_ad_header_color}','#c3092f');
		 // } else {
			//  template = template.replace('{setup_ad_header_color}','#fff');
		 // }
    uploadParams.Body = template.replace('{setup_roiq_id}',current_id).replace('{setup_roiq_id}',current_id ).replace('{setup_roiq_id}',current_id );
   uploadParams.Key = 'creatives/' +current_id + '/' + 'Dynamic_new.html'
   console.log(uploadParams);
   s3.upload(uploadParams, function(err, data) {
     //  console.log('line 184', data)
     if (err) {
       console.log("Error", err);
     } else if (data) {
       console.log("Upload Success", data.Location);
     }
   });
 } else {
	 console.log('!!!!!!!!!!!! what is this make', current_id, accounts[start].primary_make)
	//  uploadParams.Body = template_reg.replace('{setup_roiq_id}',current_id).replace('{setup_roiq_id}',current_id ).replace('{setup_roiq_id}',current_id );
	// uploadParams.Key = 'creatives/' +current_id + '/' + 'Dynamic_new.html'
	// console.log(uploadParams);
	// s3.upload(uploadParams, function(err, data) {
	// 	//  console.log('line 184', data)
	// 	if (err) {
	// 		console.log("Error", err);
	// 	} else if (data) {
	// 		console.log("Upload Success", data.Location);
	// 	}
	// });
	}
    start++;
    if(start==end){
      clearInterval(run);
    }

}, 5000)
