<template>
    <div class="login-wrapper">
        <div class="login-card">
            <h1> Food Circle </h1>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-user"></i>
                </span>
                <InputText placeholder="Username" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-lock"></i>
                </span>
                <InputText placeholder="Password" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-check"></i>
                </span>
                <InputText placeholder="Confirm Password" />
            </div>
            <Button label="Login" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            username: null,
            password: null,
            checked1: false,
            checked2: false,
            radioValue1: null,
            radioValue2: null
        };
    },
    methods: {
        login() {
            this.$router.push({ name: 'home' });
        }
    }
};
</script>

<style>
body {
    margin: 0 auto;
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