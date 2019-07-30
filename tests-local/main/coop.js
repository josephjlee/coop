var ACCOUNT_ID_attribute = Array.prototype.slice.apply(document.scripts).filter(
	function(script) {
		return script.src.indexOf('dynamic_new_custom.js') > -1;
	});

var ACCOUNT_ID = ACCOUNT_ID_attribute && ACCOUNT_ID_attribute.length > 0 ? ACCOUNT_ID_attribute[0].attributes["account_id"].value : '';

function getParams(query) {
	// reference http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
	if (!query) {
		return {};
	}
	return (/^[?#]/.test(query) ? query.slice(1) : query)
		.split('&')
		.reduce(function(params, param) {
			var _param = param.split('=');
			params[_param[0]] = _param[1] ? decodeURIComponent(_param[1].replace(/\+/g, ' ')) : '';
			return params;
		}, {});
};

var quertObj = getParams(window.location.search);

function wrapUrls(destURL, quertObj) {
	if (quertObj.click_url && quertObj.click_url !== "" && quertObj.num_dest_url_esc && quertObj.click_url.indexOf('AUCTION_CLICKTRACK_URL') == -1) {
		var click_url = decodeURIComponent(quertObj.click_url);
		var numEscapes = quertObj.click_url && quertObj.num_dest_url_esc && quertObj.click_url !== "" ? Number(quertObj.num_dest_url_esc) : 0;
		for (var i = 0; i < Number(numEscapes); i++) {
			destURL = encodeURIComponent(destURL);
		}
		console.log('click_url + destURL', click_url + destURL)

		return click_url + destURL;
	} else {
		return destURL;
	}
}

var query_string = quertObj && quertObj.Zipcode && quertObj.Zipcode !== '12345' ? "&Zipcode=" + (quertObj.Zipcode || '') + "&bw_id=" + (quertObj.bw_id || '') + "&page=" + (quertObj.page && quertObj.page !== "NaN" ? encodeURIComponent(quertObj.page) : '') + "&domain=" + (quertObj.domain && quertObj.domain !== "NaN" ? encodeURIComponent(quertObj.domain) : '') + "&creative_id=" + (quertObj.creative_id || '') + "&campaign_id=" + (quertObj.campaign_id || '') + "&flight_id=" + (quertObj.flight_id || '') : null;

function renderHTML(offers, template, make, cb) {
	var alloffers = "";
	var num = offers.length - 1;
	console.log('render html is working', offers[0]);
	var OFFERS = "";
	if (offers) {
		offers.forEach(function(offer, i) {
					if (offer.make.toLowerCase() == "nissan") {
						console.log('font is updated')
						$("*").css("font-family", "NissanBrandW15a");
					}
					if (offer.make.toLowerCase() == "infiniti") {
						$("*").css("font-family", 'Infiniti Brand');
					}
					var additional = '';
					console.log( 'additional', additional)

					// if (offer.custom_img_300x110) {
					// 	OFFERS += options.custom_img_300x110.replace('{{image_url}}', offer.custom_img_300x110)
					// };
					if (offer.payment_t1) {
						OFFERS += offer.payment_t1.replace('{{ADDITIONAL}}',additional);
					};
					if (offer.payment_t2) {
						OFFERS += offer.payment_t2.replace('{{ADDITIONAL}}',additional);
					};
					if (offer.lease_payment) {
						if(offer.make == "Nissan" || offer.make == "nissan"){
							additional = '<div id="vin">Sales Price:$ {{lease_sales_price}} Vin:{{vin}} </div>';
						}
						offer.lease_down_payment ? offer.lease_down_payment = JSON.stringify(offer.lease_down_payment).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : null;
						OFFERS += options.lease_payment_expires.replace('{{ADDITIONAL}}',additional);
						additional = "";
					};
					if (offer.price) {
						offer.price = JSON.stringify(offer.price).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
						OFFERS += options.price.replace('{{ADDITIONAL}}',additional);
					};
					if (offer.interest_rate) {
						if (offer.interest_rate == "0.0") {
							offer.interest_rate = "0";
						}
						OFFERS += options.interest_rate.replace('{{ADDITIONAL}}',additional);
					};
					if (offer.rebate_name_1) {
						if(offer.make == "Nissan" || offer.make == "nissan"){
							additional = '<div id="vin">Vin:{{vin}} </div>';
						}
						offer.rebate_amount_1 = JSON.stringify(offer.rebate_amount_1).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

						OFFERS += options.rebate_name_1.replace('{{ADDITIONAL}}',additional);
					};
					if (offer.rebate_name_2) {
						if(offer.make == "Nissan" || offer.make == "nissan"){
							additional = '<div id="vin">Vin:{{vin}} </div>';
						}
						offer.rebate_amount_2 = JSON.stringify(offer.rebate_amount_2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
						OFFERS += options.rebate_name_2.replace('{{ADDITIONAL}}',additional);
					};
					if (offer.rebate_name_3) {
						if(offer.make == "Nissan" || offer.make == "nissan"){
							additional = '<div id="vin">Vin:{{vin}} </div>';
						}
						offer.rebate_amount_3 = JSON.stringify(offer.rebate_amount_3).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
						OFFERS += options.rebate_name_3.replace('{{ADDITIONAL}}',additional);
						additional = "";
					};
					if (offer.rebate_name_4) {
						if(offer.make == "Nissan" || offer.make == "nissan"){
							additional = '<div id="vin">Vin:{{vin}} </div>';
						}
						offer.rebate_amount_4 = JSON.stringify(offer.rebate_amount_4).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
						OFFERS += options.rebate_name_4.replace('{{ADDITIONAL}}',additional);
						additional = "";
					};
					var LANDING_URL = query_string ? offer.url + query_string : offer.url;
					// CREATE OFFERS FIRST THEN UPDATE THE VARIBLES INSTEAD OF UPDATING THEM FOR ALL
					var offersVar = {
							"{{year}}": offer.year && offer.year !== 'n/a' ? offer.year : '',
							"{{make}}": offer.make,
							"{{model}}": offer.model,
							"{{url}}": LANDING_URL,
							"{{trim}}": offer.trim && offer.trim !== 'n/a' ? offer.trim : '',
							'{{payment_t1}}': offer.payment_t1 ? offer.payment_t1 : '',
							'{{finance_expiration}}': offer.finance_expiration ? offer.finance_expiration.split('T')[0] : '',
							'{{payment_t2}}': offer.payment_t2 ?  offer.payment_t2 : '',
							'{{finance_expiration}}': offer.finance_expiration ? offer.finance_expiration.split('T')[0] : '',
							'{{lease_payment}}': offer.lease_payment ? offer.lease_payment :'',
							'{{lease_expiration}}': offer.lease_expiration ? offer.lease_expiration.split('T')[0] : '',
							'{{lease_term}}': offer.lease_term,
							'{{term}}': offer.interest_rate_t1 ? offer.interest_rate_t1 : '',
							'{{interest_rate_t1}}': offer.interest_rate_t1 ? offer.interest_rate_t1 : '',
							'{{downpayment}}': offer.lease_down_payment,
							'{{price}}': offer.price,
							'{{interest_term}}': offer.interest_rate_t1 ? offer.interest_rate_t1 : '',
							'{{finance_expiration}}': offer.finance_expiration ? offer.finance_expiration.split('T')[0] : '',
							'{{interest_rate}}': offer.interest_rate,
							'{{rebate_name_1}}':offer.rebate_name_1,
							'{{rebate_amount_1}}':offer.rebate_amount_1,
							'{{rebate_name_2}}':offer.rebate_name_2,
							'{{rebate_amount_2}}':offer.rebate_amount_2,
							'{{rebate_name_3}}':offer.rebate_name_3,
							'{{rebate_amount_3}}':offer.rebate_amount_3,
							'{{rebate_name_4}}':offer.rebate_name_4,
							'{{rebate_amount_4}}':offer.rebate_amount_4,
							'{{lease_sales_price}}':offer.lease_sales_price || offer.lease_selling_price,
							'{{vin}}':offer.vin,
	};

	var keywords_o = new RegExp(Object.keys(offersVar).join('|'), 'gi');
	var edited_offers = OFFERS.replace(keywords_o, function(c) {
		return offersVar[c];
	});
	alloffers += edited_offers;
	// console.log('alloffers', alloffers, 'OFFERS', OFFERS)
	if (num == i) {
		var customValues = {
			"{{year}}": offer.year && offer.year !== 'n/a' ? offer.year : '',
			"{{make}}": offer.make,
			"{{model}}": offer.model,
			"{{trim}}": offer.trim && offer.trim !== 'n/a' ? offer.trim : '',
			"{{EVOX_ID}}": offer.evox_id,
			"{{url}}": LANDING_URL,
			"{{OFFERS}}": edited_offers,
			"{{finance_disclosure}}": offer.finance_disclosure ? offer.finance_disclosure : "See dealer for  details."
		};
		var keywords = new RegExp(Object.keys(customValues).join('|'), 'gi');
		var edited = template.replace(keywords, function(c) {
			return customValues[c];
		});
		cb(edited);
	};
});
};
};

function getParseProfile(cb) {
	var user_dt = getParams(window.location.search);
	if (user_dt.bw_id) {
		var link = "https://profiles.trafficscore.com/roiq/" + user_dt.bw_id;
		var dynamic_inv = [];
		$.get(link, function(data) {
			if (data && data.errorMessage) {
				console.log("there is no vdp");
			};
			if (data) {
				var models = Object.keys(data).map((model) => {
					var make_model = model.split('_')[1] + "_" + model.split('_')[2];
					return make_model.replace(/\ /g, '_');
				});
				cb(models);
			} else {
				cb([]);
			};
		});
	} else {
		cb([]);
	};
};

function toggledisc() {
	var disc = document.getElementsByClassName('term_details');
	disc[0].style.display == "none" ? disc[0].style.display = "block" : disc[0].style.display = "none";
	console.log(disc);
};

function updateBody(specials, template, make) {
	// $('head').append('<link rel="stylesheet" href="' + make + '.css" type="text/css" />');

	renderHTML(specials, template, make, function(t) {
		$('body').html(t);
		$('.header').append('<img src="https://cdn.dealerx.com/creatives/coop/' + make.toLowerCase() + "/header.png" + '"/>');
		$('.footer').append('<img src="https://s3.amazonaws.com/cdn.wpdlr.co/creatives/coop/' + make.toLowerCase() + '/footer.png' + '"/>');

		$("#offers").owlCarousel({
			navigation: false,
			slideSpeed: 300,
			paginationSpeed: 400,
			singleItem: true,
			autoPlay: 3000,
			pagination: false
		});

	});
};


getParseProfile(function(make_models) {
	if (make_models.length > 0) {
		var end = make_models.length;
		for (var i = 0; i < end; i++) {
			var m_m = make_models[i];
			if (specials[m_m]) {
				var make = m_m.split('_')[0];
				if (ACCOUNT_ID) {
					createAdditionalImpEvent(make, special_keys[tt].split('_')[1], true)
				};
				updateBody(specials[m_m], options.template, make);
				return;
			};
			if (i == end - 1) {
				var special_keys = Object.keys(specials);
				var length = special_keys.length;
				var tt = Math.floor(Math.random() * length);
				var make = special_keys[tt].split('_')[0];
				console.log(tt, make);
				if (ACCOUNT_ID) {
					createAdditionalImpEvent(make, special_keys[tt].split('_')[1], true)
				};
				updateBody(specials[special_keys[tt]], options.template, make);
			};
		};
	} else {
		var special_keys = Object.keys(specials);
		var length = special_keys.length;
		var tt = Math.floor(Math.random() * length);
		var make = special_keys[tt].split('_')[0];
		if (ACCOUNT_ID) {
			createAdditionalImpEvent(make, special_keys[tt].split('_')[1], false)
		};
		updateBody(specials[special_keys[tt]], options.template, make);
	};
});

function createAdditionalImpEvent(make, model, is_match) {
	console.log('createAdditionalImpEvent is running', make, model)
	quertObj.v_make = make;
	quertObj.v_model = model;
	quertObj.matched = is_match;
	var url = "https://track.trafficscore.com/itrack/?account_id=" + ACCOUNT_ID + "&event=IMP_VEHICLE&event_options=",
		src_link = url + encodeURIComponent(JSON.stringify(quertObj)),
		img = document.createElement("img");
	img.src = src_link;
};

// https://profiles.trafficscore.com/roiq/AABc0k66SLkAACHzs70nuw
// https://profiles.trafficscore.com/roiq/AAB0qk63h8YAACDR-avU8A
