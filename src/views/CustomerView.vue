<template>
    <FoodCircleOverlay :show="this.establishmentStore.loading || this.authStore.loading"
        :loadingMsg="this.establishmentStore.loadingMsg" />
    <Dialog v-model:visible="display" :modal="true">
        <template #header>
            <h3>Order from {{ clickedEstablishment.name }}</h3>
        </template>

        <MenuOptions :establishment=clickedEstablishment @updateTotal="updateTotal"></MenuOptions>

        <template #footer>
            <!-- Show the Total aligned on the right -->
            <div class="p-d-flex p-jc-between">
                <div class="flex justify-content-end mt-2">
                    <span class="p-text-bold" style="width:200px;">Total: {{ total }}</span>
                </div>
                <div class="flex justify-content-end mt-2">
                    <Button @click="submitOrder" style="width:200px;" icon="pi pi-shopping-cart"
                        label="Complete Purchase" class="mr-0 p-button-success width-200" />
                </div>
            </div>
        </template>
    </Dialog>
    <Menubar>
        <template #start class="p-0">
            <div style="width:25vw;text-align: center;">
                <h1 style="text-shadow: rgb(0 255 81 / 80%) 0px 0px 8px;color: black;justify-content: center;text-align: center;"><i class="pi pi-circle" style="font-size: 1.5rem"></i> Food Circle</h1>
            </div>
        </template>
        <template #end>
            <InputText v-model="newAddress" placeholder="Set your address:" type="text" class='mr-3'/>
            <Button label="Set" class="p-button-success" @click="changeLatLon()" />
        </template>
    </Menubar>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <RestaurantSidebar :allEstablishments="establishmentStore.allEstablishments"
                    @establishmentFocus=establishmentFocus>
                </RestaurantSidebar>
            </div>
            <div class="col-9">
                <div id="map" class="border-left-3"></div>
            </div>
        </div>
    </div>
</template>

<script>
import RestaurantSidebar from '../components/RestaurantSidebar.vue'
import MenuOptions from '../components/MenuOptions.vue'
import { API_KEY } from "./API_KEY";
import { Loader } from "google-maps";
import { useEstablishmentStore } from '../stores/establishmentStore'
import { useAuthStore } from '../stores/authStore'

const loader = new Loader(API_KEY);

export default {
    name: 'CustomerView',
    setup() {
        const authStore = useAuthStore();
        const establishmentStore = useEstablishmentStore();
        return {
            authStore,
            establishmentStore
        }
    },
    components: {
        RestaurantSidebar,
        MenuOptions
    },
    data() {
        return {
            gmap: {},
            establishmentMarkers: [],
            activeCircles: [],
            display: false,
            clickedEstablishment: {},
            total: 0,
            currOrder: { items: [] },
            newAddress: ""
        }
    },
    mounted() {
        loader.load().then((google) => this.initializeMap(google));
        setInterval(() => {
            this.activeCircles.forEach(circle => {
                let seconds = Math.floor(Date.now() / 1000);
                let max_time = circle.max_ts;
                let diff = Math.floor(max_time - seconds);
                if (diff <= 0) {
                    circle.circle.setMap(null);
                    this.activeCircles.splice(this.activeCircles.indexOf(circle), 1);
                }
            });
        }, 1000);
    },
    methods: {
        getEstabs() {
            if (this.authStore.user) {
                this.establishmentStore.getEstablishmentsByCity(this.authStore.user.cid, this.authStore.user.lat, this.authStore.user.lon);
            }
        },
        establishmentFocus(est) {
            this.clickedEstablishment = est;
            let eid = est.eid;
            this.establishmentMarkers.forEach(obj => {
                if (obj.eid === eid) {
                    this.gmap.setCenter(obj.marker.getPosition());
                    this.gmap.setZoom(15);
                    this.display = true;
                    // obj.marker.infoWindow.open(this.gmap, obj.marker);
                }
            });
        },
        initializeMap(google) {
            this.getEstabs();
            var mapOptions = {
                zoom: 13,
                mapId: 'e20fb2ffa0a58fda',
                center: { lat: this.authStore.user.lat, lng: this.authStore.user.lon },
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
            };
            this.gmap = new google.maps.Map(document.getElementById('map'), mapOptions);

            var marker = new google.maps.Marker({
                map: this.gmap,
                position: { lat: this.authStore.user.lat, lng: this.authStore.user.lon },
                title: 'Click to zoom'
            });
            marker.addListener('click', function () {
                this.gmap.setZoom(8);
                this.gmap.setCenter(marker.getPosition());
            });

            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.gmap,
                center: { lat: this.authStore.user.lat, lng: this.authStore.user.lon },
                radius: 1600
            });

            var count = 0;
            setInterval(function () {
                count = (count + 1) % 360;
                cityCircle.set('fillColor', 'hsl(' + count + ', 100%, 50%)');
                cityCircle.set('strokeColor', 'hsl(' + count + ', 100%, 50%)');
            }, 100);

            marker.setMap(this.gmap);
        },
        updateTotal(orderTotal) {
            this.total = orderTotal.total;
            this.currOrder.items = orderTotal.order;
        },
        submitOrder() {
            this.currOrder.uid = this.authStore.user.uid;
            this.currOrder.eid = this.clickedEstablishment.eid;
            this.currOrder.lat = this.authStore.user.lat;
            this.currOrder.lon = this.authStore.user.lon;
            this.currOrder.cid = this.authStore.user.cid;
            this.currOrder.status = "Pending";
            this.establishmentStore.submitOrder(this.currOrder, this.clickedEstablishment);
            this.display = false;
        },
        changeLatLon() {
            this.authStore.updateUserByAddress(this.newAddress);
        }
    },
    watch: {
        establishmentStore: {
            handler: function () {
                this.establishmentStore.allEstablishments.forEach(establishment => {
                    let lat = establishment.lat;
                    let lng = establishment.lon;
                    let name = establishment.name;
                    let address = establishment.address;
                    let description = establishment.description;
                    let eid = establishment.eid;
                    let tags = establishment.keywords;
                    let latlng = new google.maps.LatLng(lat, lng);
                    let marker = this.establishmentMarkers.find(obj => obj.eid === eid);
                    if (marker) {
                        marker.marker.setPosition(latlng);
                    }
                    else {
                        marker = new google.maps.Marker({
                            position: latlng,
                            map: this.gmap,
                            title: name,
                            icon: { // temporary icon
                                url: "https://cdn2.iconfinder.com/data/icons/places-4/100/leaf_place_marker_location_nature_eco-512.png",
                                scaledSize: new google.maps.Size(40, 40),
                            }
                        });
                        let contentString = `
                            <div class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title text-center">${name}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted text-center">${address}</h6>
                                    <p class="card-text">${description}</p>
                                    <a href="#" class="card-link">Card link</a>
                                    <a href="#" class="card-link">Another link</a>
                                </div>
                            </div>
                        `;
                        let infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        marker.addListener("click", () => {
                            this.gmap.setCenter(marker.getPosition());
                            this.gmap.setZoom(15);
                            this.clickedEstablishment = establishment;
                            this.display = true;
                        });
                        marker.infoWindow = infowindow;
                        this.establishmentMarkers.push({ eid: eid, marker: marker });
                    }
                });

                this.establishmentStore.circles.forEach(circle => {
                    let lat = circle.lat;
                    let lng = circle.lon;
                    let radius = 1600;
                    let latlng = new google.maps.LatLng(lat, lng);
                    let circleObj = this.activeCircles.find(obj => obj.lat === lat && obj.lon === lng);
                    if (circleObj) {
                        circleObj.circle.setRadius(radius);
                    }
                    else {
                        // Green circles represent the area of the 'promotion'
                        let circleg = new google.maps.Circle({
                            strokeColor: '#00FF00',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#00FF00',
                            fillOpacity: 0.35,
                            map: this.gmap,
                            center: latlng,
                            radius: radius
                        });
                        circleg.addListener("click", () => {
                            alert("Lat: " + lat + " Lon: " + lng);
                        });
                        this.activeCircles.push({ lat: lat, lon: lng, circle: circleg, max_ts: circle.max_ts });
                    }
                });
            },
            deep: true
        },
        clickedEstablishment: {
            handler: function () {
                if (this.clickedEstablishment && this.clickedEstablishment.eid) {
                    this.display = true;
                }
            },
            deep: true
        },
        display: {
            handler: function () {
                if (!this.display) {
                    this.clickedEstablishment = null;
                }
            },
            deep: true
        },
    }
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
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.col-9 {
    width: 80%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0% !important;
}

.p-menubar {
    width: 100%;
    height: 10vh;
    display: flex;
    border: none !important;
    border-radius: 0 !important;
}

.mr-2 {
    margin-right: 2rem;
}

#map {
    width: 100%;
    height: 100%;
}
</style>