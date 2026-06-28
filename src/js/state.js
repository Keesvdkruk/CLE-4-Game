export const GameState = {
    peace: 100,
    peaceCheckpoint: 100,
    
    support: 0,
    supportCheckpoint: 0,

    // Check of er al data in de browser staat als de game start
    loadStorage() {
        const savedPeace = localStorage.getItem("vestra_peace")
        const savedSupport = localStorage.getItem("vestra_support")

        if (savedPeace !== null) {
            this.peace = parseInt(savedPeace)
            this.peaceCheckpoint = this.peace
        }
        
        if (savedSupport !== null) {
            this.support = parseInt(savedSupport)
            this.supportCheckpoint = this.support
        }
    },
    saveCheckpoint() {
        this.peaceCheckpoint = this.peace;
        this.supportCheckpoint = this.support;

        localStorage.setItem("vestra_peace", this.peace)
        localStorage.setItem("vestra_support", this.support)

        console.log("Opgeslagen in LocalStorage! Peace:", this.peace, "| Support:", this.support);
    },

    // Haal de stats terug bij een Game Over
    revertToCheckpoint() {
        this.peace = this.peaceCheckpoint;
        this.support = this.supportCheckpoint;
        console.log("State hersteld naar checkpoint!");
    },

    resetAll() {
        localStorage.removeItem("vestra_peace")
        localStorage.removeItem("vestra_support")
        this.peace = 100
        this.support = 0
        this.peaceCheckpoint = 100
        this.supportCheckpoint = 0
    }
}
GameState.loadStorage()