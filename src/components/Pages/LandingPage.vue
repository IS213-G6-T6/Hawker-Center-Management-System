<script lang="ts">
import LandingCategoryMobile from './LandingCategoryMobile.vue';
import LandingCategory from './LandingCategory.vue';
export default {
    name: "LandingPage",
    methods: {
        isMobile(): boolean {
            if (screen.width <= 760) {
                return true;
            }
            else {
                return false;
            }
        },
    },
    components: { LandingCategoryMobile, LandingCategory }
}
</script>

<template>
    <div v-if="isMobile()">
        <LandingCategoryMobile></LandingCategoryMobile>
    </div>
    <div v-else>
        <LandingCategory></LandingCategory>
    </div>
</template>

<style scoped>
button {
    all: unset;
    height: 100% !important;
}
.carousel_container {
    display: flex;
    height: 100vh;
}
.carousel_text {
    font-size: 30px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    visibility: hidden;
}
.carousel_img {
    object-fit: cover;
    height: 100%;
    width: 100%;
}
.carousel_box {
    flex: 1;
    transition: 1s;
    position: relative;
}
.carousel_box:hover .carousel_text {
    visibility: visible;
}
.carousel_box:hover .carousel_img {
    opacity: 20%;
}
.carousel_box:hover {
    flex: 4;
}

@media screen and (max-width: 480px) {
    .carousel_container {
        display: flex;
        flex-direction: column;
    }

    .carousel_text {
        min-width: 200px;
        visibility: visible;
        color: #0087ca;
        padding: 20px;
        border-radius: 24px;
        background-color: rgba(255, 255, 255, 0.658);
    }
}
</style>
