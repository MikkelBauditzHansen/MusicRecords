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
            role: null
        };
    },
    methods: {
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
