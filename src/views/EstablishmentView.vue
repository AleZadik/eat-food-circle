<template>
    <div class="container">
        <div class="row">
            <Sidebar class="pct15" v-model:visible="visibleLeft" :dismissable="false" :modal="false"
                :showCloseIcon="false">
                <template #header>
                    <div class="p-d-flex p-flex-row p-ai-center p-mt-4">
                        <h1 class="title"><img src="../assets/logo.svg" alt="logo" class="logo" />FoodCircle</h1>
                    </div>
                </template>
                <div class="p-d-flex p-flex-column p-ai-center p-mt-4">
                    <div class="p-d-flex p-flex-column p-ai-center p-mt-4">
                        <div class="item">
                            <div class="option"><span>Dashboard</span></div>
                        </div>
                        <div class="item">
                            <div class="option"><span>Timeline</span></div>
                        </div>
                        <div class="item">
                            <div class="option" @click="test"><span>Establishment</span></div>
                        </div>
                    </div>
                </div>
            </Sidebar>
            <div class="pct15"></div>
            <div class="pct85">
                <Menubar :model="items" class="fullwidth-sidebar">
                    <template #start>
                        <img alt="logo" src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
                            height="40" class="mr-2">
                    </template>
                    <template #end>
                        <InputText placeholder="Search" type="text" />
                    </template>
                </Menubar>
                <div id="content"></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'EstablishmentView',
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
    },
    methods: {
        test(){
            console.log("test");
        }
    },
}

</script>
<style>
.title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    text-align: center;
    height: 100%;
}

.p-sidebar-header {
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
    height: 10vh;
}

.logo {
    width: 50px;
    height: 50px;
}

.p-sidebar-header-content {
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
}

.p-sidebar-content {
    padding: 0 !important;
}

.item {
    font-size: 1.2rem;
    color: #000;
    margin: 0;
    align-items: center;
    text-align: center;
    height: 100%;
    width: 100%;
    border-bottom: 1px solid #ebebeb;
}

.left-data {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1rem;
}

.store-summary {
    height: 300px;
}

.option {
    padding-top: 20px;
    padding-bottom: 20px;
}

.pct85 {
    width: 85vw;
    height: 100vh;
    float: right;
    background-color: rgb(255, 255, 255);
}

.pct15 {
    width: 15vw !important;
    height: 100vh !important;
    float: left;
    background-color: #17212F;
    transition: none !important;
}

.fullwidth-sidebar {
    width: 100% !important;
    background: #f8f9fa !important;
    border: none !important;
    border-bottom: gray solid 1px !important;
    border-radius: 0 !important;
}
</style>