let latitude = document.querySelector('.latitude');
let longitude = document.querySelector('.longitude');
let map;
let marker;

let locationTimeline = [];

const issLocationURL = 'http://api.open-notify.org/iss-now.json';

async function getLocation(url) {
    let response = await fetch(url, {cache: "no-cache"});
    let data = await response.json();
    return data;
}

function initMap() 
{
    setTimeout(() => {

        let coords = {
            lat: parseFloat(localStorage.getItem('latitude')),
            lng: parseFloat(localStorage.getItem('longitude'))
        };

        map = new google.maps.Map(document.getElementById('map'), {zoom: 5, center: coords});

        addMarker(coords);
        
    }, 6000);
}

function addMarker(location) {
    marker = new google.maps.Marker({position: location, map: map});
}

function issMarker(location) {

    console.log(location);
    const img = './img/space502.png';

    marker = new google.maps.Marker({position: location, map: map, icon: img});
}

function removeMarker() {
    marker.setMap(null);
}

setInterval(() => 
{
    getLocation(issLocationURL).then((data) => {

        console.log(data);
        latitude.innerHTML = data.iss_position.latitude;
        longitude.innerHTML = data.iss_position.longitude;

        localStorage.setItem('latitude', data.iss_position.latitude);
        localStorage.setItem('longitude', data.iss_position.longitude);

        return data.iss_position;

    }).then( data => {

        coords = {
            lat: parseFloat(data.latitude), 
            lng: parseFloat(data.longitude)
        };

        locationTimeline.push(coords);
        console.log(locationTimeline);

        //Add path for ISS
        
        var flightPath = new google.maps.Polyline({
            path: locationTimeline,
            geodesic: true,
            strokeColor: '#292929',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        
        flightPath.setMap(map);
        removeMarker();
        issMarker(coords);
    });
}, 5000);