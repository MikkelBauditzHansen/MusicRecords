const apiURL = "http://localhost:5151/api/music";
const loginURL = "http://localhost:5151/api/auth/login";

const app = Vue.createApp({
    data() {
        return {
            music: [],
            searchTitle: "",
            searchArtist: "",
            auth: {
                username: "",
                password: ""
            },
            token: null,
            role: null,
            newMusic: {
                title: "",
                artist: "",
                duration: 0,
                year: 0
            }
        };
    },
    methods: {
        addMusic() {
            axios.post(apiURL, this.newMusic,{
                headers: this.getAuthHeaders()
                })
            .then(response => {
                this.music.push(response.data);
                this.newMusic.title = "";
                this.newMusic.artist = "";
                this.newMusic.duration = 0;
                this.newMusic.year = 0;
                alert("Music added successfully");
            })
            .catch(error => {
                console.error("Error adding music:", error);
                alert("Failed to add music");
            });
        },
        getAuthHeaders() {
            if (this.token) {
                return {
                    Authorization: "Bearer " + this.token
                };
            }

            return {};
        },

        loadMusic() {
            axios.get(apiURL, {
                headers: this.getAuthHeaders()
            })
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
                },
                headers: this.getAuthHeaders()
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
        },

        login() {
            axios.post(loginURL, this.auth)
            .then(response => {
                this.token = response.data.token;
                this.role = response.data.role;
                this.loadMusic();
            })
            .catch(error => {
                console.error("Login failed:", error);
                alert("Login failed");
            });
        },

        logout() {
            this.token = null;
            this.role = null;
            this.music = [];
            this.auth.username = "";
            this.auth.password = "";
        }
    }
});

app.mount("#app");