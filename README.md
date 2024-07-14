# 2D-survival-game
I've created a React component that implements the 2D survival game Here's a breakdown of the main features:

Game board: A 10x10 grid using SVG.
Player: Represented by a blue circle, controllable with arrow keys or on-screen buttons.
Opponents: Red circles that move randomly.
Items: Gold squares that spawn randomly and increase the score when collected.
Scoring: Increases by collecting items and surviving longer.
Difficulty progression: Opponents move faster and new opponents are added as the score increases.
Game over: Triggered when the player collides with an opponent.
Sound effects: Simple sounds for movement, item collection, and game over (simulated with placeholder URLs).
Restart option: Available after game over.

The game logic is implemented in a single React component, focusing on creating an engaging gameplay loop with clear objectives and escalating challenges.
To use this component, you would need to import it into your main React application file and render it. You may also need to set up the necessary styling and ensure that the required UI components from the shadcn/ui library are properly installed and imported.
