export const GameState = {
    // Peace stat (begint op 100)
    peace: 100,
    peaceCheckpoint: 100,
    
    // NIEUW: Support stat (begint op 0)
    support: 0,
    supportCheckpoint: 0,

    // Slaat alle stats op bij het begin van een level
    saveCheckpoint() {
        this.peaceCheckpoint = this.peace;
        this.supportCheckpoint = this.support;
        console.log("Checkpoints opgeslagen! Peace:", this.peace, "| Support:", this.support);
    },

    // Zet alle stats terug naar de opgeslagen waarden bij een KO/herstart
    revertToCheckpoint() {
        this.peace = this.peaceCheckpoint;
        this.support = this.supportCheckpoint;
        console.log("State hersteld! Peace:", this.peace, "| Support:", this.support);
    }
}