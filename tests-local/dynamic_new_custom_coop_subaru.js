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
	if (quertObj.click_url && quertObj.click_url !== "" && quertObj.num_dest_url_esc) {
		var click_url = decodeURIComponent(quertObj.click_url);
		var numEscapes = quertObj.click_url && quertObj.num_dest_url_esc && quertObj.click_url !== "" ? Number(quertObj.num_dest_url_esc) : 0;
		for (var i = 0; i < Number(numEscapes); i++) {
			destURL = encodeURIComponent(destURL);
		}
		return click_url + destURL;
	} else {
		return destURL;
	}
}

var query_string = "&Zipcode=" + (quertObj.Zipcode || '') + "&bw_id=" + (quertObj.bw_id || '') + "&page=" + (quertObj.page && quertObj.page !== "NaN" ? encodeURIComponent(quertObj.page) : '') + "&domain=" + (quertObj.domain && quertObj.domain !== "NaN" ? encodeURIComponent(quertObj.domain) : '') + "&creative_id=" + (quertObj.creative_id || '') + "&campaign_id=" + (quertObj.campaign_id || '') + "&flight_id=" + (quertObj.flight_id || '');
// console.log(quertObj, query_string)
function renderHTML(offers, template, cb) {
	var alloffers = "";
	var num = offers.length - 1;
	if (offers) {
		offers.forEach(function(offer, i) {
			var OFFERS = "";
			if (offer.custom_img_300x110) {
				OFFERS += options_subaru.custom_img.replace('{{image_url}}', offer.custom_img_300x110)
			};
			if (offer.payment_t1) {
				OFFERS += offer.finance_expiration ? options_subaru.payment_t1_expires.replace('{{payment_t1}}', offer.payment_t1).replace('{{finance_expiration}}', offer.finance_expiration.split('T')[0]) : options_subaru.payment_t1.replace('{{payment_t1}}', offer.payment_t1);
			};
			if (offer.payment_t2) {
				OFFERS += offer.finance_expiration ? options_subaru.payment_t2_expires.replace('{{payment_t1}}', offer.payment_t2).replace('{{finance_expiration}}', offer.finance_expiration.split('T')[0]) : options_subaru.payment_t2.replace('{{payment_t1}}', offer.payment_t2);
			};
			if (offer.lease_payment) {
				OFFERS += offer.lease_expiration ? options_subaru.lease_payment_expires.replace('{{lease_payment}}', offer.lease_payment).replace('{{lease_expiration}}', offer.lease_expiration.split('T')[0]).replace('{{term}}', offer.lease_term).replace('{{downpayment}}', offer.lease_down_payment) : options_subaru.lease_payment.replace('{{lease_payment}}', offer.lease_payment);
			};
			if (offer.price) {
				offer.price = JSON.stringify(offer.price).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				OFFERS += options_subaru.price.replace('{{price}}', offer.price);
			};
			if (offer.interest_rate) {
				if (offer.interest_rate == "0.0") {
					offer.interest_rate = "0";
				}
				OFFERS += offer.finance_expiration ? options_subaru.interest_rate_expires.replace('{{interest_rate}}', offer.interest_rate).replace('{{finance_expiration}}', offer.finance_expiration.split('T')[0]) : options_subaru.interest_rate.replace('{{interest_rate}}', offer.interest_rate);
			};
			if (offer.rebate_name_1) {
				offer.rebate_amount_1 = JSON.stringify(offer.rebate_amount_1).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

				OFFERS += options_subaru.rebate_name_1.replace('{{rebate_name_1}}', offer.rebate_name_1).replace('{{rebate_amount_1}}', offer.rebate_amount_1);
			};
			if (offer.rebate_name_2) {
				offer.rebate_amount_2 = JSON.stringify(offer.rebate_amount_2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				OFFERS += options_subaru.rebate_name_2.replace('{{rebate_name_2}}', offer.rebate_name_2).replace('{{rebate_amount_2}}', offer.rebate_amount_2);
			};
			if (offer.rebate_name_3) {
				offer.rebate_amount_3 = JSON.stringify(offer.rebate_amount_3).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				OFFERS += options_subaru.rebate_name_3.replace('{{rebate_name_3}}', offer.rebate_name_3).replace('{{rebate_amount_3}}', offer.rebate_amount_3);
			};
			if (offer.rebate_name_4) {
				offer.rebate_amount_4 = JSON.stringify(offer.rebate_amount_4).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				OFFERS += options_subaru.rebate_name_4.replace('{{rebate_name_4}}', offer.rebate_name_4).replace('{{rebate_amount_4}}', offer.rebate_amount_4);
			};
			var LANDING_URL = query_string ? offer.url + query_string : offer.url;
			var offersVar = {
				"{{year}}": offer.year && offer.year !== 'n/a' ? offer.year : '',
				"{{make}}": offer.make,
				"{{model}}": offer.model,
				"{{url}}": wrapUrls(LANDING_URL, quertObj),
				"{{trim}}": offer.trim && offer.trim !== 'n/a' ? offer.trim : '',
			};

			var keywords_o = new RegExp(Object.keys(offersVar).join('|'), 'gi');
			var edited_offers = OFFERS.replace(keywords_o, function(c) {
				return offersVar[c];
			});
			alloffers += edited_offers;
			if (num == i) {
				var customValues = {
					"{{year}}": offer.year && offer.year !== 'n/a' ? offer.year : '',
					"{{make}}": offer.make,
					"{{model}}": offer.model,
					"{{trim}}": offer.trim && offer.trim !== 'n/a' ? offer.trim : '',
					"{{EVOX_ID}}": offer.evox_id,
					"{{url}}": wrapUrls(LANDING_URL, quertObj),
					"{{OFFERS}}": alloffers,
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

function getParams(query) {
	if (!query) {
		return {};
	};
	return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce(function(params, param) {
		var _param = param.split('=');
		params[_param[0]] = _param[1] ?
			(_param[1].includes('+') ?
				decodeURIComponent(_param[1].replace(/\+/g, ' ')) :
				_param[1]) : '';
		return params;
	}, {});
};

function toggledisc() {
	var disc = document.getElementsByClassName('term_details');
	disc[0].style.display == "none" ? disc[0].style.display = "block" : disc[0].style.display = "none";
	console.log(disc);
};

function updateBody(specials, template, make_css) {
	$('head').append('<link rel="stylesheet" href="' + make_css + '" type="text/css" />');
	renderHTML(specials, template, function(t) {

		$('body').html(t);

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
				updateBody(specials[m_m], options_subaru.template, options_subaru[make]);
				return;
			};
			if (i == end - 1) {
				var special_keys = Object.keys(specials);
				var length = special_keys.length;
				var tt = Math.floor(Math.random() * length);
				var make = special_keys[tt].split('_')[0];
				console.log(tt, make);
				updateBody(specials[special_keys[tt]], options_subaru.template, options_subaru[make]);
			};
		};
	} else {
		var special_keys = Object.keys(specials);
		var length = special_keys.length;
		var tt = Math.floor(Math.random() * length);
		var make = special_keys[tt].split('_')[0];
		updateBody(specials[special_keys[tt]], options_subaru.template, options_subaru[make]);
	};
});
