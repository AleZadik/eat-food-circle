<template>
   <div :class="show ? 'overlay' : 'overlay hidden'">
      <div class="loading-wrapper">
         <span class="mb-5">Loading...</span>
         <div class="spinner"></div>
         <span class="pt-5">{{ loadingMsg }}</span>

      </div>
   </div>
</template>

<script>
export default {
   name: 'FoodCircleOverlay',
   props: {
      show: {
         type: Boolean,
         required: true
      },
      loadingMsg: {
         type: String,
         required: false,
         default: 'Please wait...'
      }
   },
}
</script>

<style>
.spinner {
   width: 56px;
   height: 56px;
   display: grid;
   border: 4.5px solid #0000;
   border-radius: 50%;
   border-color: #CFD186 #0000;
   animation: spinner-e04l1k 1s infinite linear;
}

.spinner::before,
.spinner::after {
   content: "";
   grid-area: 1/1;
   margin: 2.2px;
   border: inherit;
   border-radius: 50%;
}

.spinner::before {
   border-color: #5b8c5a #0000;
   animation: inherit;
   animation-duration: 0.5s;
   animation-direction: reverse;
}

.spinner::after {
   margin: 8.9px;
}

@keyframes spinner-e04l1k {
   100% {
      transform: rotate(1turn);
   }
}

.overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.8);
   z-index: 1102;
   display: flex;
   justify-content: center;
   align-items: center;
}

.loading-wrapper {
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   background-color: #000000;
   border-radius: 10px;
   padding: 20px;
   width: 300px;
   height: 200px;
   color: #fff;
}
</style>