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
            },
            editMusic: {
                id: null,
                title: "",
                artist: "",
                duration: 0,
                year: 0
            }
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
            this.clearEdit();
        },

        addMusic() {
            axios.post(apiURL, this.newMusic, {
                headers: {
                    ...this.getAuthHeaders(),
                    "Content-Type": "application/json"
                }
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

        startEdit(record) {
            this.editMusic.id = record.id;
            this.editMusic.title = record.title;
            this.editMusic.artist = record.artist;
            this.editMusic.duration = record.duration;
            this.editMusic.year = record.year;
        },

        updateMusic() {
            axios.put(apiURL + "/" + this.editMusic.id, this.editMusic, {
                headers: {
                    ...this.getAuthHeaders(),
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                const index = this.music.findIndex(m => m.id === this.editMusic.id);

                if (index !== -1) {
                    this.music[index] = response.data;
                }

                this.clearEdit();
                alert("Music updated successfully");
            })
            .catch(error => {
                console.error("Error updating music:", error);
                alert("Failed to update music");
            });
        },

        deleteMusic(id) {
            axios.delete(apiURL + "/" + id, {
                headers: this.getAuthHeaders()
            })
            .then(() => {
                this.music = this.music.filter(m => m.id !== id);
                alert("Music deleted successfully");
            })
            .catch(error => {
                console.error("Error deleting music:", error);
                alert("Failed to delete music");
            });
        },

        clearEdit() {
            this.editMusic.id = null;
            this.editMusic.title = "";
            this.editMusic.artist = "";
            this.editMusic.duration = 0;
            this.editMusic.year = 0;
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
        }
    }
});

app.mount("#app");
