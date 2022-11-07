<template>
    <div class="w-full ml-5 mr-5 mt-5">
        <h1 class="mt-0 text-white">{{ this.establishmentStore.establishment.name }} Timeline</h1>
        <div class="card-container">
            <Slider v-model="ts" :range="true" :step="0.5" style="border:10px solid black;" />
        </div>
        <div class="flex flex-row mt-1">
            <Button class="p-button-rounded p-button-text" icon="pi pi-play" @click="play" />
            <Button class="p-button-rounded p-button-text" icon="pi pi-pause" @click="pause" />
            <Button class="p-button-rounded p-button-text" icon="pi pi-refresh" @click="reset" />
            <Button class="p-button-rounded p-button-text" icon="pi pi-angle-double-right" @click="speedUp" />
        </div>
        <div class="map-holder mt-3" style="width:100%;height: 700px;">
            <div class="map" id="map" style="border:10px solid black;"></div>
        </div>
    </div>
</template>

<script>
import { useEstablishmentStore } from '../stores/establishmentStore'
import { useAuthStore } from '../stores/authStore'
import { API_KEY } from "../views/API_KEY";
import { Loader } from "google-maps";
const loader = new Loader(API_KEY);

export default {
    name: 'TimelineContent',
    setup() {
        const authStore = useAuthStore();
        const establishmentStore = useEstablishmentStore();
        return {
            authStore,
            establishmentStore
        }
    },
    data() {
        return {
            gmap: {},
            ts: [0, 0],
        }
    },
    mounted() {
        loader.load().then((google) => this.initializeMap(google));
    },
    methods: {
        getEstablishment() {
            if (this.authStore.user.uid) {
                this.establishmentStore.getEstablishmentByUID(this.authStore.user.uid);
            }
        },
        initializeMap(google) {
            this.getEstablishment();
            var mapOptions = {
                zoom: 14,
                center: { lat: this.establishmentStore.establishment.lat, lng: this.establishmentStore.establishment.lon },
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
            };
            this.gmap = new google.maps.Map(document.getElementById('map'), mapOptions);

            let marker = new google.maps.Marker({
                map: this.gmap,
                position: { lat: this.establishmentStore.establishment.lat, lng: this.establishmentStore.establishment.lon },
                title: 'Your establishment!',
                icon: { // temporary icon
                    url: "https://cdn2.iconfinder.com/data/icons/places-4/100/leaf_place_marker_location_nature_eco-512.png",
                    scaledSize: new google.maps.Size(40, 40),
                }
            });

            let infoWindow = new google.maps.InfoWindow({
                content: this.establishmentStore.establishment.name
            });

            infoWindow.open(this.gmap, marker);
            marker.addListener('click', () => {
                infoWindow.open(this.gmap, marker);
            });

            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.gmap,
                center: { lat: this.establishmentStore.establishment.lat, lng: this.establishmentStore.establishment.lon },
                radius: 100
            });

            // var count = 0;
            // setInterval(function () {
            //     count = (count + 1) % 360;
            //     cityCircle.set('fillColor', 'hsl(' + count + ', 100%, 50%)');
            //     cityCircle.set('strokeColor', 'hsl(' + count + ', 100%, 50%)');
            // }, 100);

            marker.setMap(this.gmap);
        },
        play() {
            let circle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.gmap,
                center: { lat: this.establishmentStore.establishment.lat, lng: this.establishmentStore.establishment.lon },
                radius: 1000
            });

            let direction = 1;
            let rMin = 800, rMax = 1600;
            let count = 0
            setInterval(function () {
                count = (count + 1) % 360;
                circle.set('fillColor', 'hsl(' + count + ', 100%, 50%)');
                circle.set('strokeColor', 'hsl(' + count + ', 100%, 50%)');
                let radius = circle.getRadius();
                if ((radius > rMax) || (radius < rMin)) {
                    direction *= -1;
                }
                circle.setRadius(radius + direction * 20);
            }, 50);
        },
    },
}
</script>

<style>
.p-slider-horizontal {
    width: 100%;
    height: 4rem !important;
}

#map {
    width: 100%;
    height: 100%;
}

.slider-content {
    height: fit-content;
}

.p-slider .p-slider-range {
    border: 1px solid cadetblue;
    /* gradient background color*/
    background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%) !important;
}

.p-slider {
    background: #17212F !important;
}
</style>