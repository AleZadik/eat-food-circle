<template>
    <Dialog v-model:visible="display" :modal="true">
        <template #header>
            <h3>Welcome to Food Circle!</h3>
        </template>

        It looks like it's your first time here! Would you like to create an account as
        a <b>customer</b> or an <b>establishment</b>?

        <template #footer>
            <Button @click="updateUser('customer')" label="Customer" icon="pi pi-user"/>
            <Button @click="updateUser('establishment')" label="Establishment" icon="pi pi-shopping-bag" autofocus />
        </template>
    </Dialog>
    <div class="login-wrapper">
        <div class="login-card">
            <h1> Food Circle </h1>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-user"></i>
                </span>
                <InputText v-model="name" placeholder="Name" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-lock"></i>
                </span>
                <InputText v-model="email" placeholder="Email" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-map-marker"></i>
                </span>
                <Button @click="requestLocation" class="location-btn" :label="locationText" :disabled="locBtnDisabled"/>
            </div>
            <Button @click="login" :disabled="loading">
                <ProgressSpinner v-if="loading" style="width:40px;height:40px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
                <span v-else>Login</span>
            </Button>
        </div>
    </div>
</template>

<script>
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
            name: '',
            email: '',
            locationText: 'Get Location',
            latitude: null,
            longitude: null,
            locBtnDisabled: false,
            display: false,
            loading: false
        };
    },
    mounted(){
        this.checkLogin();
    },
    watch: {
        authStore: {
            handler: function(){
                if(this.authStore.user && this.authStore.user.u_type === "unset"){
                    this.display = true;
                    this.loading = false;
                }
                else{
                    this.loading = false;
                    this.display = false;
                    this.$router.push({name: this.authStore.user.u_type});
                }
            },
            deep: true
        }
    },
    methods: {
        login(){
            this.loading = true;
            if(!this.latitude || !this.longitude){
                this.requestLocation();
                this.authStore.login(this.name, this.email, this.latitude, this.longitude);
            }
            else{
                this.authStore.login(this.name, this.email, this.latitude, this.longitude);
            }
        },
        checkLogin(){
            let user = this.authStore.user;
            if(user && user.uid){
                if(user.u_type === "unset"){
                    this.display = true;
                }
                else{
                    this.$router.push({name: user.u_type});
                }
            }
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
        },
        updateUser(userType){
            this.authStore.updateUserType(userType);
            this.display = false;
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

.p-dialog .p-dialog-footer{
    text-align: left !important;
}
</style>