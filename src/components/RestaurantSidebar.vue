<!-- List of Restaurants -->
<template>
    <p>Test</p>
</template>

<script>
export default{
    name: 'RestaurantSidebar',
    props: {
        lat: {
            type: Number,
            default: 0
        },
        lng: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            map: null,
            marker: null
        }
    },
}
</script>