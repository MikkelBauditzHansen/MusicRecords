const apiURL = "http://localhost:5151/api/music";
const app = Vue.createApp({
    data() {
        return {
            music:[],
            searchTitle: "",
            searchArtist: ""
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
                    this.music = [];
                });
        },
        searchMusic() {
            axios.get(apiURL, {
                params: {
                    title: this.searchTitle,
                    artist: this.searchArtist
                }
            })
                .then(response => {
                    this.music = response.data || [];
                })
                .catch(error => {
                    console.error("Error searching music:", error);
                    this.music = [];
            });
        },
        clearSearch() {
    this.searchTitle = "";
    this.searchArtist = "";
    this.loadMusic();
}
    },
    mounted() {
        this.loadMusic();
    }
});
app.mount("#app");
