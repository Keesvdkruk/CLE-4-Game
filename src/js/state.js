export const GameState = {
    peace: 100,
    peaceCheckpoint: 100, // De back-up van je score

    // Slaat de huidige peace-waarde op (aanroepen in onActivate)
    saveCheckpoint() {
        this.peaceCheckpoint = this.peace;
        console.log("Checkpoint opgeslagen in State! Waarde is nu:", this.peace);
    },

    // Zet de peace-waarde terug naar de back-up (aanroepen bij restart)
    revertToCheckpoint() {
        this.peace = this.peaceCheckpoint;
        console.log("State hersteld naar checkpoint! Waarde is weer:", this.peace);
    }
}