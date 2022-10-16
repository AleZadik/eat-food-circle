<template>
    <Menubar :model="items">
        <template #start>
            <img alt="logo" src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" height="40"
                class="mr-2">
        </template>
        <template #end>
            <InputText placeholder="Search" type="text" />
        </template>
    </Menubar>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <RestaurantSidebar />
            </div>
            <div class="col-9">
                <div id="map"></div>
            </div>
        </div>
    </div>
</template>

<script>
import RestaurantSidebar from '../components/RestaurantSidebar.vue'
import { API_KEY } from "./API_KEY";
import { Loader } from "google-maps";
const loader = new Loader(API_KEY);

export default {
    name: 'CustomerView',
    components: {
        RestaurantSidebar
    },
    data() {
        return {
            user: {
                name: 'John Doe',
                email: 'test@test.com'
            },
            checked1: false,
            checked2: false,
            radioValue1: '',
            radioValue2: '',
            visibleLeft: true
        }
    },
    mounted() {
        loader.load().then(function (google) {
        var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
        var mapOptions = {
            zoom: 13,
            center: myLatlng,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            map: map,
            position: myLatlng,
            title: 'Click to zoom'
        });
        marker.addListener('click', function () {
            map.setZoom(8);
            map.setCenter(marker.getPosition());
        });

        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: myLatlng,
            radius: 500
        });

        var count = 0;
        setInterval(function () {
            count = (count + 1) % 360;
            cityCircle.set('fillColor', 'hsl(' + count + ', 100%, 50%)');
        }, 100);
        
        marker.setMap(map);
        });
  },
};
</script>

<style>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.row {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.col-3 {
    width: 20%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: lightseagreen;
}

.col-9 {
    width: 80%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(113, 150, 148);
}

.p-menubar {
    width: 100%;
    height: 10vh;
    display: flex;
}

.mr-2 {
    margin-right: 2rem;
}

#map {
    width: 100%;
    height: 100%;
}
</style>