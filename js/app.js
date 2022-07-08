// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded


'use strict';

var geo_running = false;
var geo_good = false;

function getLocation() {
  console.log(`XYZ get geolocation.`);
  if (geo_running) {
    return;
  } else {
    geo_running = true;
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 60000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;

    if (!geo_good) {
      geo_good = true;
    }
    geo_running = false;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    document.getElementById("demo-x").innerHTML = crd.longitude;
    document.getElementById("demo-y").innerHTML = crd.latitude;
    document.getElementById("demo-a").innerHTML = crd.accuracy;
  }

  function error(err) {
    console.warn(`XYZ Geo ERROR: (${err.code}): ${err.message}`);
    geo_running = false;

    if (err.code == 2) {
    // The geolocation is disabled.
      if (window.confirm("Change geolocation setting?")) {
        var activity = new WebActivity('configure', {
                       target: 'device',
                       section: 'geolocation'
                    });

        activity.start().then(rv => {
          // activity finised, do something
          console.log("Success: " + rv);
          setTimeout(getLocation, 1000);
        },
        err => {
          // activity cancel do something
          console.log('Error: ' + err);
        });
      }
    } else if (err.code == 1) {
    // The geolocation permission is denied by user.
      if (window.confirm("Change apps permissions?")) {
        var activity = new WebActivity("configure", {
            target: 'device',
            section: 'app_permissions'
        });

        activity.start().then(rv => {
          // activity finised, do something
          console.log("Success: " + rv);
          setTimeout(getLocation, 1000);
        },
        err => {
          // activity cancel do something
          console.log('Error: ' + err);
        });
      }
    } else {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  function handleKeyUpEvent(e) {
    console.log('on keyup: ' + e.key);
    switch(e.key) {
	case "Backspace":
	break;
	case "1":
  	getLocation();
	break;
    }
  }
  document.body.addEventListener("keyup", handleKeyUpEvent);

  window.addEventListener('atmpressure', e => {
    let atmpressure = e.value.toFixed(4);

    var now = new Date().valueOf()

	console.log(' calculated_millis : ' + now +'  pressure : ' + atmpressure );
	      document.getElementById("demo-z").innerHTML = atmpressure;

    if (geo_good) {
      getLocation();
    }
  });

  getLocation();
});
