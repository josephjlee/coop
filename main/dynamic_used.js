var ACCOUNT_ID = Array.prototype.slice.apply(document.scripts).filter(
	function(script) {
		return script.src.indexOf('dynamic_used.js') > -1;
	})[0].attributes["account_id"].value;

var cacheinv = document.createElement('script');
cacheinv.addEventListener('load', tmplparse);
var version = /^.{8}/.exec(new Date().toISOString().replace(/-/g, ''));
cacheinv.src = "https://cdn.dealerx.com/creatives/" + ACCOUNT_ID + "/json/all_used_cars_.js" + "?version=" + version;
console.log('cacheinv.src', cacheinv.src)
document.body.appendChild(cacheinv);
var quertObj = getParams(window.location.search);
var query_string = quertObj && quertObj.Zipcode && quertObj.Zipcode !== '12345' ? "&Zipcode=" + (quertObj.Zipcode || '') + "&bw_id=" + (quertObj.bw_id || '') + "&page=" + (quertObj.page && quertObj.page !== "NaN" ? encodeURIComponent(quertObj.page) : '') + "&domain=" + (quertObj.domain && quertObj.domain !==
	"NaN" ? encodeURIComponent(quertObj.domain) : '') + "&creative_id=" + (quertObj.creative_id || '') + "&campaign_id=" + (quertObj.campaign_id || '') + "&flight_id=" + (quertObj.flight_id || '') : {};

function tmplparse() {
	console.log('tmplparse is working')
	var keywords = Object.keys(used_inventory);
	var inventory = used_inventory;
	console.log('keywords', keywords)

	function createAdditionalImpEvent(make, model, is_match) {
		console.log('createAdditionalImpEvent is running', make, model)
		quertObj.v_make = make;
		quertObj.v_model = model;
    quertObj.matched = is_match;
		var url = "https://track.trafficscore.com/itrack/?account_id=" + ACCOUNT_ID + "&event=IMP_VEHICLE&event_options=",
			src_link = url + encodeURIComponent(JSON.stringify(quertObj)),
			img = document.createElement("img");
		img.src = src_link;
    console.log('img', img.src, img)
	}

	function imgError(){
		console.log('image has error!!!!', this)
	}

	var veh_detail_html =
		"<a href=\"LANDING_URL\" target=\"_blank\">\
                                  <div id=\"SOME_CODE\" class=\"vehicle_details\">\
																	<img src=\"IMG_SRC\" onerror=\"this.onerror=null;this.src=\"https://img.dealerx.com/fuel/stills/undefined/undefined_st0640_090.png\";imgError();\" alt=\"Vehicle\"/>\
                                    <div class=\"single_title\">\
                                      VEHICLE_TITLE\
                                    </div>\
                                    <div class=\"single_price\">\
                                      PRICE_VEHICLE\
                                    </div>\
                                    <div class=\"cta\" style=\"background-color:BTTN_COLOR\">SHOP NOW</div>\
                                  </div>\
                                </a>";
	var veh_gallery_html = "<a href=\"LANDING_URL\" target=\"_blank\"><div class=\"SOME_CODE\">" +
		"<img src=\"IMG_SRC\" onerror=\"this.onerror=null;this.src=\"https://img.dealerx.com/fuel/stills/undefined/undefined_st0640_090.png\";imgError();\"\" alt=\"Vehicle\"/><div class=\"single_title\">VEHICLE_TITLE</div><div class=\"single_price\">PRICE_VEHICLE</div><div class=\"cta\" style=\"background-color:BTTN_COLOR\">SHOP NOW</div></div></a>";
	var default_inventory = [];

	function updateDefault() {
		var length = keywords.length;
		var tt = [Math.floor(Math.random() * length)];
		if (default_inventory.length < 5) {
			var k = keywords[tt]
			inventory[k].forEach(function(el) {
				default_inventory.push(el)
			})
			updateDefault();
		}
	};
	updateDefault();
	update_vehicle_gallery(default_inventory);
	update_vehicle_detail(default_inventory[0])

  getParseProfile((models) => {
		var dynamic_inv = [];
		if (models.length > 0) {
			console.log('models', models);
			for (var i = 0; i < models.length; i++) {
        var key = models[i].key;
        if (dynamic_inv.length < 5) {
          if(inventory[key] ){
          				inventory[key].forEach(function(c) {
          					dynamic_inv.push(c)
             	})
            };
        } else {
          				default_inventory = dynamic_inv;
      						// console.log('new inventory', default_inventory)
      		        createAdditionalImpEvent(default_inventory[0].make,default_inventory[0].model, true);
      						update_vehicle_gallery(default_inventory);
      						break;
        }
      }
		} else {
          console.log('no profile',models )
          createAdditionalImpEvent(default_inventory[0].make,default_inventory[0].model, false );
    }
  });


	function craftGallery(tag, array) {
		var final_value = "",
			s = 0;
		end = array.length;
		for (var i = s; i < end; i++) {
			var LANDING_URL = query_string && query_string.Zipcode ? array[i].url + query_string : array[i].url;

			customValues = {
				"VEHICLE_TITLE": array[i].year + " " + array[i].make + " " + array[i].model,
				"IMG_SRC": array[i].image_s,
				"SOME_CODE": "inventory" + i,
				"PRICE_VEHICLE": array[i].price == "Call" ? "SHOP NOW" : "$ " + array[i].price,
				"LANDING_URL": LANDING_URL,
				"BTTN_COLOR": BTTN_COLOR ? BTTN_COLOR : ''
			}
			var keywords = new RegExp(Object.keys(customValues).join("|"), "gi");
			var chunk_html = tag.replace(keywords, function(c) {
				return customValues[c]
			})
			final_value += chunk_html;
		}
		return final_value
	}

	function craftDetails(tag, vehicle) {
		var final_value = "";
		var LANDING_URL = query_string && query_string.Zipcode ? vehicle.url + query_string : vehicle.url;
		var customValues = {
			"VEHICLE_TITLE": vehicle.year + " " + vehicle.make + " " + vehicle.model,
			"IMG_SRC": vehicle.image_s,
			"PRICE_VEHICLE": vehicle.price == "Call" ? "" : "$ " + vehicle.price,
			"LANDING_URL": LANDING_URL,
			"BTTN_COLOR": BTTN_COLOR ? BTTN_COLOR : ''
		}
		var keywords = new RegExp(Object.keys(customValues).join("|"), "gi");
		var final_value = tag.replace(keywords, function(c) {
			return customValues[c]
		})
		return final_value
	}

	function getParseProfile(cb) {
		if (quertObj.bw_id) {
			var link = "https://profiles.trafficscore.com/roiq/" + quertObj.bw_id;
			console.log('link', link)
			$.get(link, function(data) {
				console.log('data', data)
				if (data && data.errorMessage) {
					console.log("there is no vdp");
				};
				if (data) {
					var models = Object.keys(data).map((model) => {
						var m = model.split('_')[1];
						var mo = model.split('_')[2];
						var make_model = m + "_" + mo;
						return {
							key: make_model.replace(/\ /g, '_'),
							make: m,
							model: mo
						};
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


	function parce_VDP_name(name) {
		var cleanName = name.replace('vdps.', "").split("_");
		for (var c = 0; c < cleanName.length; c++) {
			if (cleanName[c].includes("%20")) {
				var clean = cleanName[c].split("%20")[0]
				cleanName[c] = clean;
			}
		}
		var key_name = cleanName[0] + "_" + cleanName[1]
		return key_name
	}

	function update_vehicle_detail(vehicle) {
		var updated_details = craftDetails(veh_detail_html, vehicle);
		$('.vd').fadeOut(250, 'swing').html(updated_details).fadeIn(500, 'swing').delay(4000).fadeOut(250, 'swing');
	}

	function update_vehicle_gallery(default_inventory) {
		var updated_gallery = craftGallery(veh_gallery_html, default_inventory);
		$('.vehicle_gallery').html(updated_gallery)
	};
	var i = 0;
	setInterval(function() {
		update_vehicle_detail(default_inventory[i]);
		i++;
		if (i == default_inventory.length - 1) {
			i = 0;
		}
	}, 5000);
}

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
