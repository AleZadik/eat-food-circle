<!-- List of Restaurants -->
<template>

    <div class="surface-card shadow-2 pl-4 pt-4 pb-4 pr-2" style="width: 100%;height: 100%;">
        <div class="flex justify-content-between align-items-center" style="height: 10%;">
            <span class="text-xl text-900 font-medium">Establishments in your Area</span>
            <div>
                <!-- Todo: Filter popups -->
                <!-- <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                    @click="$refs.menu4.toggle($event)"></Button> -->
                <!-- <Menu ref="menu4" :popup="true" :model="items"></Menu> -->
            </div>
        </div>
        <ul class="list-none p-0 m-0" style="overflow-y:scroll;height:90%;overflow-x:hidden">
            <li class="estab mb-5 cursor-pointer" v-for="establishment in allEstablishments"
                @click="establishmentFocus(establishment)">
                <div class="align-items-center">
                    <div>
                        <div class="text-900 font-medium text-lg mb-2">{{ establishment.name }}</div>
                        <div class="flex align-items-center">
                            <span v-for="k in establishment.keywords"
                                class="flex p-1 bg-green-100 text-1f2d40-600 font-medium text-sm border-round ml-0 mr-1">{{
                                        k
                                }}</span>
                        </div>
                    </div>
                </div>
                <div class="block benefits">
                    <strong>
                        <p class="pop-text" style="text-align:center;color: #E3655B;">Popularity Meter</p>
                    </strong>
                    <div class="input-flex-container">
                        <!-- @TODO: Refactor when I get the chance to use v-for -->
                        <div v-bind:class="establishment.popmeter <= 1 ? 'input active' : 'input'"> <!-- first is always active -->
                            <span :data-year="establishment.promo ? establishment.promo[0] : 'Free Soda'"></span>
                        </div>
                        <div v-bind:class="establishment.popmeter <= 2 ? 'input active' : 'input'">
                            <span :data-year="establishment.promo ? establishment.promo[1] : '5% Off'"></span>
                        </div>
                        <div v-bind:class="establishment.popmeter <= 3 ? 'input active' : 'input'">
                            <span :data-year="establishment.promo ? establishment.promo[2] : '5% Off'"></span>
                        </div>
                        <div v-bind:class="establishment.popmeter <= 4 ? 'input active' : 'input'">
                            <span :data-year="establishment.promo ? establishment.promo[3] : 'Free Burger'"></span>
                        </div>
                        <div v-bind:class="establishment.popmeter >= 5 ? 'input active' : 'input'">
                            <span :data-year="establishment.promo ? establishment.promo[4] : '10% Off'"></span>
                        </div>
                    </div>
                    <div class="block text-right w-full pr-4">
                        <p class='estab-timer' style="color:#E3655B;" v-if="establishment.timer && establishment.timer > 0">Timer: {{establishment.timer}} s</p>
                        <p v-else>Timer:  900s</p>
                    </div>
                </div>
                <p class='order-text m-0' style="color:white">Order before the timer to receive highlighted benefits!</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'RestaurantSidebar',
    props: {
        allEstablishments: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            map: null,
            marker: null,
        }
    },
    methods: {
        establishmentFocus(establishment) {
            console.log(establishment);
            this.$emit('establishmentFocus', establishment);
        },
    },
    mounted() {
        // For each establishment, make establishment.timer decrease by 1 every second if they differ from 900
        setInterval(() => {
            this.allEstablishments.forEach(establishment => {
                let seconds = Math.floor(Date.now() / 1000);
                let max_time = establishment.max_ts;
                let diff = Math.floor(max_time - seconds);
                if (diff > 0) {
                    establishment.timer = diff;
                } else {
                    establishment.popmeter = 0;
                    establishment.timer = 900;
                }
            });
        }, 1000);
    },
}
</script>

<style>
.input-flex-container {
    display: flex;
    justify-content: space-around;
    /* align-items: center; */
    width: 20vw;
    height: 100px;
    max-width: 1000px;
    position: relative;
    z-index: 0;
}

.input {
    width: 25px;
    height: 25px;
    background-color: #5B8C5A;
    position: relative;
    border-radius: 50%;
}

.input::before,
.input::after {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    top: 50%;
    transform: translateY(-50%);
    background-color: #5B8C5A;
    width: 2vw;
    height: 5px;
    max-width: 100px;
}

.input::before {
    left: calc(-2vw + 12.5px);
}

.input::after {
    right: calc(-2vw + 12.5px);
}

.input.active {
    background-color: #5B8C5A;
}

.input.active::before {
    background-color: #5B8C5A;
}

.input.active::after {
    background-color: #CFD186;
}

.input.active span {
    font-weight: 700;
}

.input.active span::before {
    font-size: 13px;
}

.input.active span::after {
    font-size: 15px;
}

.input.active~.input,
.input.active~.input::before,
.input.active~.input::after {
    background-color: #CFD186;
}

.input span {
    width: 1px;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    visibility: hidden;
    color: #5B8C5A;
}

.input span::before,
.input span::after {
    visibility: visible;
    position: absolute;
    left: 50%;
}

.input span::after {
    content: attr(data-year);
    top: 25px;
    transform: translateX(-50%);
    font-size: 14px;
}

.input span::before {
    content: attr(data-info);
    top: -65px;
    width: 70px;
    transform: translateX(-5px) rotateZ(-45deg);
    font-size: 12px;
    text-indent: -10px;
}

.estab:hover {
    opacity: 60%;
}
</style>