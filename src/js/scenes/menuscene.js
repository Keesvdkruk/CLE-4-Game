import { Color, Scene, Label, Font, FontUnit, Actor, Rectangle, TextAlign } from "excalibur";
import { GameState } from "../state.js";

import { Southreach } from "./Southreach.js";
import { Ironvale } from "./ironvale.js";
import { IronvaleFactory } from "./ironvaleFactory.js";
import { Eastwatch } from "./Eastwatch.js";
import { VestraCity } from "./vestracity.js";
import { VestraCityInside } from "./vestracityinside.js";
import { RoadToSquare } from "./roadtosquare.js";
import { PeacefulRoadToSquare } from "./peacefulroadtosquare.js";
import { Square } from "./square.js";
import { ViolenceSquare } from "./violencesquare.js";

function createFreshScene(sceneName) {
    switch (sceneName) {
        case "southreach": return new Southreach();
        case "ironvale": return new Ironvale();
        case "ironvalefactory": return new IronvaleFactory();
        case "eastwatch": return new Eastwatch();
        case "vestracity": return new VestraCity();
        case "vestracityinside": return new VestraCityInside();
        case "roadtosquare": return new RoadToSquare();
        case "peacefulroadtosquare": return new PeacefulRoadToSquare();
        case "square": return new Square();
        case "violencesquare": return new ViolenceSquare();
        default: return new Southreach();
    }
}

function resetScenesFrom(engine, sceneName) {
    const sceneOrder = [
        "southreach",
        "ironvale",
        "ironvalefactory",
        "eastwatch",
        "vestracity",
        "vestracityinside",
        "roadtosquare",
        "peacefulroadtosquare",
        "square",
        "violencesquare"
    ];

    const startIndex = sceneOrder.indexOf(sceneName);

    if (startIndex === -1) {
        return;
    }

    for (let i = startIndex; i < sceneOrder.length; i++) {
        const sceneToReset = sceneOrder[i];

        engine.removeScene(sceneToReset);
        engine.addScene(sceneToReset, createFreshScene(sceneToReset));
    }
}

export class MenuScene extends Scene {
    onInitialize(engine) {
        const overlay = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            width: engine.drawWidth,
            height: engine.drawHeight
        });

        overlay.graphics.use(new Rectangle({
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: Color.fromRGB(0, 0, 0, 0.92)
        }));

        this.add(overlay);

        const title = new Label({
            text: "LEVEL OVERVIEW",
            x: engine.drawWidth / 2,
            y: 90,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 58,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(title);

        const subtitle = new Label({
            text: "Kies een level dat je al bereikt hebt.",
            x: engine.drawWidth / 2,
            y: 155,
            color: Color.Gray,
            font: new Font({
                family: "MijnPixelFont",
                size: 26,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(subtitle);

        const levels = [
            { name: "Southreach", scene: "southreach" },
            { name: "Ironvale", scene: "ironvale" },
            { name: "Eastwatch", scene: "eastwatch" },
            { name: "Vestra City", scene: "vestracity" }
        ];

        const startY = 230;
        const spacing = 44;

        const goToFreshScene = (sceneName) => {
            engine.canvas.style.cursor = "default";

            GameState.revertToCheckpoint();
            GameState.currentScene = sceneName;

            resetScenesFrom(engine, sceneName);
            engine.goToScene(sceneName);
        };

        levels.forEach((level, index) => {
            const unlocked = GameState.unlockedLevels.includes(level.scene);

            const levelLabel = new Label({
                text: unlocked ? level.name : level.name + " LOCKED",
                x: engine.drawWidth / 2,
                y: startY + index * spacing,
                color: unlocked ? Color.White : Color.DarkGray,
                font: new Font({
                    family: "MijnPixelFont",
                    size: 30,
                    unit: FontUnit.Px,
                    textAlign: TextAlign.Center
                })
            });

            this.add(levelLabel);

            if (unlocked) {
                levelLabel.on("pointerenter", () => {
                    engine.canvas.style.cursor = "pointer";
                    levelLabel.color = Color.Yellow;
                });

                levelLabel.on("pointerleave", () => {
                    engine.canvas.style.cursor = "default";
                    levelLabel.color = Color.White;
                });

                levelLabel.on("pointerdown", () => {
                    goToFreshScene(level.scene);
                });
            }
        });

        const backLabel = new Label({
            text: "BACK",
            x: engine.drawWidth / 2,
            y: 665,
            color: Color.Red,
            font: new Font({
                family: "MijnPixelFont",
                size: 34,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(backLabel);

        backLabel.on("pointerenter", () => {
            engine.canvas.style.cursor = "pointer";
            backLabel.color = Color.White;
        });

        backLabel.on("pointerleave", () => {
            engine.canvas.style.cursor = "default";
            backLabel.color = Color.Red;
        });

        backLabel.on("pointerdown", () => {
            engine.canvas.style.cursor = "default";
            engine.goToScene(GameState.currentScene || "southreach");
        });
    }
}