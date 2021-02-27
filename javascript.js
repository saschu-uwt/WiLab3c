var map = L.map('map').setView([47.25, -122.46], 12);
L.tileLayer('https://api.mapbox.com/styles/v1/saschu/ckl493xxy35s017qmc8gf09ei/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FzY2h1IiwiYSI6ImNrZ3poNGVkYjA1b3Ayd3JzOHczb29iNjEifQ.MqXTIcUhZl4C-s0Jk5o49A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
}).addTo(map);


// Makes the layer (feature group) to draw to
var drawnItems = L.featureGroup().addTo(map);

// Creates a layer to display points and shapes from Carto database
var cartoData = L.layerGroup().addTo(map);
var url = "https://saschu.carto.com/api/v2/sql";
var urlGeoJSON = url + "?format=GeoJSON&q=";
var sqlQuery = "SELECT the_geom, fname, lname, email, phone, instructions, variety1, variety2, variety3 FROM city_fruit_registration";
function addPopup(feature, layer) {
    layer.bindPopup(
        "<b>Name: </b>" + feature.properties.fname + " " +
        feature.properties.lname + "</b><br>" +
        "<b>Email: </b>" + feature.properties.email + "<br>" +
        "<b>Phone: </b>" + feature.properties.phone + "<br>" +
        "<b>Special Instructions:</b><br>" + feature.properties.instructions + "<br>" +
        "<b>Fruit 1: </b>" + feature.properties.variety1 + "<br>" +
        "<b>Fruit 2: </b>" + feature.properties.variety2 + "<br>" +
        "<b>Fruit 3: </b>" + feature.properties.variety3 + "<br>"
    );
}
// Grabs the data from the Carto database, puts it into var cartData (defined above)
fetch(urlGeoJSON + sqlQuery)
    .then(function(response) {
    return response.json();
    })
    .then(function(data) {
        L.geoJSON(data, {onEachFeature: addPopup}).addTo(cartoData);
    });

// Geolocation
  function onLocationFound(e) {
      var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method. The unit is meters.

      L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
          .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

          //this adds a circle to the map centered at the lat and long returned by the locate function. Its radius is set to the var radius defined above.
        if (radius <= 100) {
              L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
          }
        else {
              L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
          }
    }

    map.on('locationfound', onLocationFound); //this is the event listener

    function onLocationError(e) {
      alert(e.message);
    }
    map.on('locationerror', onLocationError); // In case of location error

// Locator button
var stateChangingButton = L.easyButton({
    states: [{
            stateName: 'zoom-to-location',// name the state
            icon:      'w3-large fa fa-crosshairs',        // and define its properties
            title:     'zoom to your location',// like its title
            onClick: function(btn, map) { // and its callback
                map.locate({setView: true, maxZoom: 16});
                // map.setView([46.25,-121.8],10);
                // btn.state('zoom-to-school');// change state on click!
            }
    }]
});

stateChangingButton.addTo(map);

// Makes the drawing tools
new L.Control.Draw({
    draw : {
        polygon : false,       // Polygons disabled
        polyline : false,      // Polylines disabled
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

// Add an HTML form that is also a popup
function createFormPopup() {
    var popupContent =
        '<form class="form-container">' +
        'Today\'s Date: <input type="date" id="input_date"><br><br>' +
        'Canvasser: <input type="text" id="input_canvasID"><br><br>' +
        'Owner Interest: <input type="radio" id="yes" name="interest" value="yes"> Yes  ' +
          '<input type="radio" id="no" name="interest" value="no"> No  ' +
          '<input type="radio" id="unk" name="interest" value="unk"> Not Home <br><br>' +
        '<fieldset class="conditional">' +
          'First name: <input type="text" id="input_fname"><br><br>' +
          'Last name: <input type="text" id="input_lname"><br><br>' +
          'E-mail: <input type="email" id="input_email"><br><br>' +
          'Phone number: <input type="tel" id="input_phone"><br><br>' +
          'Special instructions: <br><textarea rows="5" cols="40"  id="input_instructions" name="instructions"></textarea><br><br>' +
          '<hr><br>' +
          '<b>First tree</b> variety: <select id="input_variety1" name="variety1">' +
            '<option value="none"> </option>' +
            '<option value="apple">apple</option>' +
            '<option value="berry">berry</option>' +
            '<option value="blackberry">blackberry</option>' +
            '<option value="cherry">cherry</option>' +
            '<option value="crabapple">crabapple</option>' +
            '<option value="fig">fig</option>' +
            '<option value="loquat">loquat</option>' +
            '<option value="peach">peach</option>' +
            '<option value="pear">pear</option>' +
            '<option value="asian">pear, Asian</option>' +
            '<option value="euro">pear, Euro</option>' +
            '<option value="persimmon">persimmon</option>' +
            '<option value="plum">plum</option>' +
            '<option value="quince">quince</option>' +
            '<option value="unknown">unknown</option>' +
          '</select><br><br>' +
          'Estimated ripening time: <select id="input_ripe1" name="ripe1">' +
            '<option value="none"> </option>' +
            '<option value="earlyJun">early June</option>' +
            '<option value="lateJun">late June</option>' +
            '<option value="earlyJul">early July</option>' +
            '<option value="lateJul">late July</option>' +
            '<option value="earlyAug">early August</option>' +
            '<option value="lateAug">late August</option>' +
            '<option value="earlySep">early September</option>' +
            '<option value="lateSep">late September</option>' +
            '<option value="earlyOct">early October</option>' +
            '<option value="lateOct">late October</option>' +
            '<option value="Nov">November</option>' +
            '<option value="Dec">December</option>' +
          '</select><br><br>' +
          'Notes: <br><textarea rows="5" cols="40"  id="input_notes1" name="notes1"></textarea><br><br>' +
          '<hr><br>' +
          '<b>Second tree</b> variety: <select id="input_variety2" name="variety2">' +
            '<option value="none"> </option>' +
            '<option value="apple">apple</option>' +
            '<option value="berry">berry</option>' +
            '<option value="blackberry">blackberry</option>' +
            '<option value="cherry">cherry</option>' +
            '<option value="crabapple">crabapple</option>' +
            '<option value="fig">fig</option>' +
            '<option value="loquat">loquat</option>' +
            '<option value="peach">peach</option>' +
            '<option value="pear">pear</option>' +
            '<option value="asian">pear, Asian</option>' +
            '<option value="euro">pear, Euro</option>' +
            '<option value="persimmon">persimmon</option>' +
            '<option value="plum">plum</option>' +
            '<option value="quince">quince</option>' +
            '<option value="unknown">unknown</option>' +
          '</select><br><br>' +
          'Estimated ripening time: <select id="input_ripe2" name="ripe2">' +
            '<option value="none"> </option>' +
            '<option value="earlyJune">early June</option>' +
            '<option value="lateJune">late June</option>' +
            '<option value="earlyJuly">early July</option>' +
            '<option value="lateJuly">late July</option>' +
            '<option value="earlyAug">early August</option>' +
            '<option value="lateAug">late August</option>' +
            '<option value="earlySep">early September</option>' +
            '<option value="lateSep">late September</option>' +
            '<option value="earlyOct">early October</option>' +
            '<option value="lateOct">late October</option>' +
            '<option value="November">November</option>' +
            '<option value="December">December</option>' +
          '</select><br><br>' +
          'Notes: <br><textarea rows="5" cols="40"  id="input_notes2" name="notes2"></textarea><br><br>' +
          '<hr><br>' +
          '<b>Third tree</b> variety: <select id="input_variety3" name="variety3">' +
            '<option value="none"> </option>' +
            '<option value="apple">apple</option>' +
            '<option value="berry">berry</option>' +
            '<option value="blackberry">blackberry</option>' +
            '<option value="cherry">cherry</option>' +
            '<option value="crabapple">crabapple</option>' +
            '<option value="loquat">loquat</option>' +
            '<option value="fig">fig</option>' +
            '<option value="peach">peach</option>' +
            '<option value="pear">pear</option>' +
            '<option value="asian">pear, Asian</option>' +
            '<option value="euro">pear, Euro</option>' +
            '<option value="persimmon">persimmon</option>' +
            '<option value="plum">plum</option>' +
            '<option value="quince">quince</option>' +
            '<option value="unknown">unknown</option>' +
          '</select><br><br>' +
          'Estimated ripening time: <select id="input_ripe3" name="ripe3">' +
            '<option value="none"> </option>' +
            '<option value="earlyJune">early June</option>' +
            '<option value="lateJune">late June</option>' +
            '<option value="earlyJuly">early July</option>' +
            '<option value="lateJuly">late July</option>' +
            '<option value="earlyAug">early August</option>' +
            '<option value="lateAug">late August</option>' +
            '<option value="earlySep">early September</option>' +
            '<option value="lateSep">late September</option>' +
            '<option value="earlyOct">early October</option>' +
            '<option value="lateOct">late October</option>' +
            '<option value="November">November</option>' +
            '<option value="December">December</option>' +
          '</select><br><br>' +
          'Notes: <br><textarea rows="5" cols="40"  id="input_notes3" name="notes3"></textarea><br><br>' +
        '</fieldset><br>' +
        '<input type="button" class="btn" value="Submit" id="submit">' +
        '</form>'
    drawnItems.bindPopup(popupContent).openPopup();
}

// Event listner that adds items drawn to the drawnItems layer so they don't immediately disappear. It also fires the HTML form popup from above.
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});

// Print data to the console
function setData(e) {

    if(e.target && e.target.id == "submit") {

// Get data from inputs
        var enteredDate = document.getElementById("input_date").value;
        var enteredCanvasID = document.getElementById("input_canvasID").value;
        var enteredFName = document.getElementById("input_fname").value;
        var enteredLName = document.getElementById("input_lname").value;
        var enteredEmail = document.getElementById("input_email").value;
        var enteredPhone = document.getElementById("input_phone").value;
        var enteredInstructions = document.getElementById("input_instructions").value;
        var enteredVariety1 = document.getElementById("input_variety1").value;
        var enteredRipe1 = document.getElementById("input_ripe1").value;
        var enteredNotes1 = document.getElementById("input_notes1").value;
        var enteredVariety2 = document.getElementById("input_variety2").value;
        var enteredRipe2 = document.getElementById("input_ripe2").value;
        var enteredNotes2 = document.getElementById("input_notes2").value;
        var enteredVariety3 = document.getElementById("input_variety3").value;
        var enteredRipe3 = document.getElementById("input_ripe3").value;
        var enteredNotes3 = document.getElementById("input_notes3").value;


// Put that information in the Carto database
        // For each drawn layer
        drawnItems.eachLayer(function(layer) {

        // First, create SQL expression to insert layer
        var drawing = JSON.stringify(layer.toGeoJSON().geometry);
        var sql =
            "INSERT INTO city_fruit_registration (the_geom, date, canvasid, fname, lname, email, phone, instructions, variety1, ripe1, notes1, variety2, ripe2, notes2, variety3, ripe3, notes3) " +
            "VALUES (ST_SetSRID(ST_GeomFromGeoJSON('" +
            drawing + "'), 4326), '" +
            enteredDate + "', '" +
            enteredCanvasID + "', '" +
            enteredFName + "', '" +
            enteredLName + "', '" +
            enteredEmail + "', '" +
            enteredPhone + "', '" +
            enteredInstructions + "', '" +
            enteredVariety1 + "', '" +
            enteredRipe1 + "', '" +
            enteredNotes1 + "', '" +
            enteredVariety2 + "', '" +
            enteredRipe2 + "', '" +
            enteredNotes2 + "', '" +
            enteredVariety3 + "', '" +
            enteredRipe3 + "', '" +
            enteredNotes3 + "')";
        console.log(sql);

        // Second, send the data to the Carto SQL API
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "q=" + encodeURI(sql)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Data saved:", data);
        })
        .catch(function(error) {
            console.log("Problem saving the data:", error);
        });

        // Finally, transfer submitted drawing to the CARTO layer so it persists on the map without you having to refresh the page
        var newData = layer.toGeoJSON();
        newData.properties.date = enteredDate;
        newData.properties.canvasid = enteredCanvasID;
        newData.properties.fname = enteredFName;
        newData.properties.lname = enteredLName;
        newData.properties.email = enteredEmail;
        newData.properties.phone = enteredPhone;
        newData.properties.instructions = enteredInstructions;
        newData.properties.variety1 = enteredVariety1;
        newData.properties.ripe1 = enteredRipe1;
        newData.properties.notes1 = enteredNotes1;
        newData.properties.variety2 = enteredVariety2;
        newData.properties.ripe2 = enteredRipe2;
        newData.properties.notes2 = enteredNotes2;
        newData.properties.variety3 = enteredVariety3;
        newData.properties.ripe3 = enteredRipe3;
        newData.properties.notes3 = enteredNotes3;
        L.geoJSON(newData, {onEachFeature: addPopup}).addTo(cartoData);

        });

        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();

    }
}

// Makes the setData function run
document.addEventListener("click", setData);

// Makes the popup HTML form go away when the user is editing the shape/line/point. Once the user is happy with their drawing, the popup will reappear.
map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});
