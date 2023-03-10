<script lang="ts">
export default {
    name: 'LandingCategory',
    data() {
        return {
            categories: [
                { name: 'services', url: '/assets/services.jpg', text: 'Manicure & massage & hairstyling'},
                { name: 'fnb', url: '/assets/f&b.jpg', text: 'Our favourite local brand desserts' },
                { name: 'fashion', url: '/assets/fashion.jpg', text: 'Dress up Fashion up'},
                { name: 'crafts', url: '/assets/crafts.jpg', text: 'Find your favourite handicrafts here' },
                { name: 'experiences', url: '/assets/experiences.jpeg', text: 'Time to experience some thrills' },
            ],
        }
    },
    methods: {
        routePage() {
            this.$router.push('/Home')
        },
    },
}
</script>

<template>
    <div class="absolute top-8 left-12 z-50">
        <div class="flex items-center md:px-3">
            <img
                src="/assets/logo.png"
                class="mr-3 h-8 sm:h-9"
                alt="BigRedDot Logo" />
            <span
                class="self-center text-xl font-semibold whitespace-nowrap text-white">
                BigRedDot
            </span>
        </div>
    </div>
    <div class="carousel_container">
        <div v-for="category of categories" class="carousel_box">
            <button
                @click="
                    this.$store.dispatch('commitCat', category.name),
                        routePage()
                ">
                <p class="carousel_text">
                    <div>{{ category.name }}</div>
                    <div class="pt-4 text-lg font-light">{{category.text}}</div>
                </p>
                <img class="carousel_img" :src="category.url" />
            </button>
        </div>
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
</style>
