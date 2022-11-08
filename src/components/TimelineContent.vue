<template>
    <div class="w-full ml-5 mr-5 mt-5">
        <h1 class="mt-0 text-white">{{ this.establishmentStore.establishment.name }} Timeline</h1>
        <div class="card-container">
            <Slider :min="this.establishmentStore.orders.first_ts" :max="this.establishmentStore.orders.last_ts"
                v-model="ts" :range="true" :step="1" style="border:10px solid black;" />
        </div>
        <div class="flex flex-row mt-1">
            <Button class="p-button-rounded p-button-text" icon="pi pi-play" @click="play" />
            <Button class="p-button-rounded p-button-text" icon="pi pi-pause" @click="pause" />
            <Button class="p-button-rounded p-button-text" icon="pi pi-refresh" @click="reset" />
            <Button class="p-button-rounded p-button-text" icon="pi pi-angle-double-right" @click="speedUp"/>
        </div>
        
        <div class="map-holder mt-3" style="width:100%;height: 700px;">
            <h4 style="color:white;" v-if="ts[0] != 0 && ts[1] != 0 && ts[0] != ts[1]">
                Start:  {{ ts[0] != 0 ? secondsToDate(ts[0]) : 'No data' }} <br>
                End: {{ ts[1] != 0 ? secondsToDate(ts[1]) : 'No data' }} <br>
                Revenue: ${{ this.totalRevenue }} <br>
                Orders: {{ this.totalOrders }} <br>
                Circles: {{ this.totalCircles }} <br>
            </h4>
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
var markers = [];
var circles = [];
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
            tm: null,
            filtered: {},
            speed: 2,
            playing : false,
            totalRevenue: 0,
            totalOrders: 0,
            totalCircles: 0,
        }
    },
    mounted() {
        loader.load().then((google) => this.initializeMap(google));
    },
    methods: {
        getEstablishment() {
            if (this.authStore.user.uid) {
                this.establishmentStore.getEstablishmentByUID(this.authStore.user.uid);
                this.establishmentStore.getEstablishmentOrders(this.establishmentStore.establishment.eid);
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

            //  infoWindow.open(this.gmap, marker);
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
            if (this.tm) {
                clearInterval(this.tm);
            }
            if (this.ts[0] == 0 || this.ts[1] == 0) {
                this.ts[0] = this.establishmentStore.orders.first_ts;
                this.ts[1] = this.establishmentStore.orders.first_ts;
                this.playing = true;
            }
            let inc = this.establishmentStore.orders.last_ts - this.establishmentStore.orders.first_ts;
            inc = inc / 100;
            this.tm = setInterval(() => {
                this.playing = true;
                this.establishmentStore.getOrdersBetweenFirstAndLastTs(this.ts[0], this.ts[1]);
                if (this.ts[1] < this.establishmentStore.orders.last_ts) {
                    this.ts[1] += inc;
                } else {
                    clearInterval(this.tm);
                    this.ts[1] = this.establishmentStore.orders.last_ts;
                    this.playing = false;
                }
            }, 1000);
        },
        pause() {
            clearInterval(this.tm);
            this.playing = false;
        },
        resetControl(){
            markers.forEach(m => {
                m.setMap(null);
            });
            circles.forEach(c => {
                c.setMap(null);
            });
            circles = [];
            markers = [];
            this.totalRevenue = 0;
            this.totalOrders = 0;
            this.totalCircles = 0;
        },
        reset() {
            this.resetControl();
            this.ts = [this.establishmentStore.orders.first_ts, this.establishmentStore.orders.first_ts];
            this.playing = false;
        },
        speedUp() {
            let inc = this.establishmentStore.orders.last_ts - this.establishmentStore.orders.first_ts;
            inc = inc / 100;
            clearInterval(this.tm);
            this.tm = setInterval(() => {
                this.playing = true;
                this.establishmentStore.getOrdersBetweenFirstAndLastTs(this.ts[0], this.ts[1]);
                if (this.ts[1] + inc < this.establishmentStore.orders.last_ts) {
                    this.ts[1] += inc;
                } else {
                    clearInterval(this.tm);
                    this.ts[1] = this.establishmentStore.orders.last_ts;
                    this.playing = false;
                }
            }, 500);
        },
        secondsToDate(seconds) {
            var date = new Date(0);
            date.setUTCSeconds(seconds);
            return date.toLocaleString();
        },
    },
    watch: {
        establishmentStore: {
            handler() {
                this.filtered = this.establishmentStore.filtered_orders;
                for (let j = 0; j < Object.keys(this.filtered).length; j++) {
                    let orders = this.filtered['' + j]?.orders;
                    if (!orders || !orders.length) continue;
                    for (let i = 0; i < orders.length; i++) {
                        let order = orders[i];
                        // add a marker for each order, if it doesn't exist
                        if (markers.find(m => m.oid == order.oid)) continue;
                        // if (markers.find(m => m.lat == order.lat && m.lon == order.lon)) continue;

                        const gMarker = new google.maps.Marker({
                            map: this.gmap,
                            position: { lat: order.lat, lng: order.lon },
                            title: 'Order ' + order.oid,
                        });
                        gMarker.oid = order.oid;
                        gMarker.lat = order.lat;
                        gMarker.lon = order.lon;
                        markers.push(gMarker);
                        // if this order has already been added to the map, then don't add it again...
                        if (circles.find(c => c.oid == j)) continue;
                        let circle = new google.maps.Circle({
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.6,
                            strokeWeight: 2,
                            fillColor: '#00FF00',
                            fillOpacity: 0.15,
                            map: this.gmap,
                            center: { lat: order.lat, lng: order.lon },
                            radius: 1600
                        });
                        circle.oid = j;

                        let infowindow = new google.maps.InfoWindow({
                            content: "<span style='color:white;'>Total: $" + this.filtered['' + j].total + "<br/>Orders: "+orders.length+"</span>",
                        });
                        this.totalRevenue += this.filtered['' + j].total;
                        this.totalRevenue = Math.round(this.totalRevenue * 100) / 100;
                        this.totalCircles += 1;
                        this.totalOrders += orders.length;
                        circle.addListener('click', function () {
                            infowindow.setPosition(circle.center)
                            infowindow.open(this.gmap, circle);
                        });

                        google.maps.event.trigger(circle, 'click'); // it works! 
                        circle.setMap(this.gmap);
                        circles.push(circle);
                    }
                }
            },
            deep: true
        },
        ts: {
            handler() {
                if(this.playing) return;
                this.resetControl();
                this.establishmentStore.getOrdersBetweenFirstAndLastTs(this.ts[0], this.ts[1]);
            },
            deep: true
        }
    }
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

.gm-style .gm-style-iw-d::-webkit-scrollbar-track, 
.gm-style .gm-style-iw-d::-webkit-scrollbar-track-piece,
.gm-style .gm-style-iw-c,
.gm-style .gm-style-iw-t::after { 
  background: rgb(18, 0, 42);
}
.gm-style .gm-style-iw-tc::after {   background: rgb(18, 0, 42) }

.gm-ui-hover-effect>span {
    background: rgb(255, 255, 255) !important;
}
</style>