export const GameState = {
    peace: 100,
    peaceCheckpoint: 100,

    support: 0,
    supportCheckpoint: 0,

    currentScene: "southreach",

    unlockedLevels: ["southreach"],

    levelNames: {
        southreach: "Southreach",
        ironvale: "Ironvale",
        ironvalefactory: "Ironvale Factory",
        eastwatch: "Eastwatch",
        vestracity: "Vestra City",
        vestracityinside: "Vestra City Inside",
        roadtosquare: "Road To Square",
        peacefulroadtosquare: "Peaceful Road To Square",
        square: "Square",
        violencesquare: "Violence Square"
    },

    loadStorage() {
        const savedPeace = localStorage.getItem("vestra_peace");
        const savedSupport = localStorage.getItem("vestra_support");
        const savedLevels = localStorage.getItem("vestra_unlockedLevels");
        const savedCurrentScene = localStorage.getItem("vestra_currentScene");

        if (savedPeace !== null) {
            this.peace = parseInt(savedPeace);
            this.peaceCheckpoint = this.peace;
        }

        if (savedSupport !== null) {
            this.support = parseInt(savedSupport);
            this.supportCheckpoint = this.support;
        }

        if (savedLevels !== null) {
            this.unlockedLevels = JSON.parse(savedLevels);
        }

        if (savedCurrentScene !== null) {
            this.currentScene = savedCurrentScene;
        }
    },

    saveCheckpoint() {
        this.peaceCheckpoint = this.peace;
        this.supportCheckpoint = this.support;

        localStorage.setItem("vestra_peace", this.peace);
        localStorage.setItem("vestra_support", this.support);
        localStorage.setItem("vestra_unlockedLevels", JSON.stringify(this.unlockedLevels));
        localStorage.setItem("vestra_currentScene", this.currentScene);
    },

    revertToCheckpoint() {
        this.peace = this.peaceCheckpoint;
        this.support = this.supportCheckpoint;
    },

    unlockLevel(levelName) {
        if (!this.unlockedLevels.includes(levelName)) {
            this.unlockedLevels.push(levelName);
        }

        this.currentScene = levelName;

        localStorage.setItem("vestra_unlockedLevels", JSON.stringify(this.unlockedLevels));
        localStorage.setItem("vestra_currentScene", this.currentScene);
    },

    enterLevel(levelName) {
        this.currentScene = levelName;

        if (!this.unlockedLevels.includes(levelName)) {
            this.unlockedLevels.push(levelName);
        }

        localStorage.setItem("vestra_unlockedLevels", JSON.stringify(this.unlockedLevels));
        localStorage.setItem("vestra_currentScene", this.currentScene);
    },

    resetAll() {
        localStorage.removeItem("vestra_peace");
        localStorage.removeItem("vestra_support");
        localStorage.removeItem("vestra_unlockedLevels");
        localStorage.removeItem("vestra_currentScene");

        this.peace = 100;
        this.support = 0;
        this.peaceCheckpoint = 100;
        this.supportCheckpoint = 0;

        this.currentScene = "southreach";
        this.unlockedLevels = ["southreach"];
    }
};

GameState.loadStorage();