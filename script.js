const apiURL = "http://localhost:5151/api/music";
const app = Vue.createApp({
    data() {
        return {
            music:[]
        }
    },
    methods: {
        loadMusic() {
            axios.get(apiURL)
                .then(response => {
                    this.music = response.data;
                })
                .catch(error => {
                    console.error("Error fetching music data:", error);
                    alert("Failed to load music data. Please try again later.");
                });
        }
    },
    mounted() {
        this.loadMusic();
    }
});
app.mount("#app");
