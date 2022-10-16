<template>
    <div class="login-wrapper">
        <div class="login-card">
            <h1> Food Circle </h1>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-user"></i>
                </span>
                <InputText placeholder="Name" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-lock"></i>
                </span>
                <InputText placeholder="Email" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-map-marker"></i>
                </span>
                <Button @click="requestLocation" class="location-btn" :label="locationText" :disabled="locBtnDisabled"/>
            </div>
            <Button @click="login" label="Login" />
        </div>
    </div>
</template>

<script>
// Use the useAuthStore store from pinia
import { useAuthStore } from '../stores/authStore'

export default {
    name: 'LoginView',
    setup(){
        const authStore = useAuthStore()
        return {
            authStore
        }
    },
    data() {
        return {
            locationText: 'Get Location',
            latitude: null,
            longitude: null,
            locBtnDisabled: false
        };
    },
    mounted(){
        this.checkLogin();
    },
    methods: {
        login(){
            this.authStore.setUserId(1);
            console.log(this.authStore.getUserId);
        },
        checkLogin(){
            if(this.authStore.uid){
                this.$router.push({name: 'playground'})
            }
            console.log(this.authStore.uid);
        },
        requestLocation() {
            this.locationText = 'Getting Location...';
            navigator.geolocation.getCurrentPosition((position) => {
                this.locationText = 'Location Found!';
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.locBtnDisabled = true;
                this.locationText = "("+this.latitude + ', ' + this.longitude + ")";
            }, (error) => {
                this.locationText = 'Location Not Found!';
            });
        }
    }
};
</script>

<style>
body {
    margin: 0 auto;
}

.location-btn{
    width: 100%;
    background-color: #17212f !important;
    text-align: left !important;
    color: rgba(255, 255, 255, 0.87) !important;
    border: 1px solid #304562 !important;
}

.login-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('https://t2.tudocdn.net/603541?w=1920');
    background-size: cover;
    background-repeat: no-repeat;
}

.login-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #17212f;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }

    100% {
        transform: translateY(0px);
    }
}

.login-card h1 {
    color: white;
}

/* Add margin left and top on the inputs */
.p-inputgroup {
    padding: 10px;
}

/* Add margin left and top on the buttons */
.p-inputgroup .p-button {
    padding: 10px;
}
</style>