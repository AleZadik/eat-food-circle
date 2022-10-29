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
                <RestaurantSidebar :allEstablishments="establishmentStore.allEstablishments"
                    @establishmentFocus=establishmentFocus>
                </RestaurantSidebar>
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
        RestaurantSidebar
    },
    data() {
        return {
            gmap: {},
            establishmentMarkers: [],
        }
    },
    mounted() {
        this.getEstabs();
        loader.load().then(this.initializeMap);
    },
    methods: {
        getEstabs() {
            if (this.authStore.user) {
                this.establishmentStore.getEstablishmentsByCity(this.authStore.user.cid);
            }
        },
        establishmentFocus(eid) {
            this.establishmentMarkers.forEach(obj => {
                if (obj.eid === eid) {
                    this.gmap.setCenter(obj.marker.getPosition());
                    this.gmap.setZoom(15);
                    obj.marker.infoWindow.open(this.gmap, obj.marker);
                }
            });
        },
        initializeMap(google) {
            var mapOptions = {
                zoom: 13,
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
                radius: 500
            });

            var count = 0;
            setInterval(function () {
                count = (count + 1) % 360;
                cityCircle.set('fillColor', 'hsl(' + count + ', 100%, 50%)');
                cityCircle.set('strokeColor', 'hsl(' + count + ', 100%, 50%)');
            }, 100);

            marker.setMap(this.gmap);
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

                    let marker = new google.maps.Marker({
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
                        infowindow.open(this.gmap, marker);
                    });
                    marker.infoWindow = infowindow;
                    this.establishmentMarkers.push({ eid: eid, marker: marker });
                });
            },
            deep: true
        }
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