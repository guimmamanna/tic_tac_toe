# Love Tic Tac Toe

## Description

A futuristic, human-vs-robot Tic Tac Toe built with Streamlit. Play against a "human-ish" AI that adapts to your difficulty setting, with a bold, neon-inspired UI and instant bot responses.

## Why This Project Exists

This project is a playful, lightweight web game meant to demonstrate clean UI design, fast interaction loops, and a simple but engaging AI opponent that feels more human than perfect.

## Features

- Human vs. AI with adjustable difficulty
- Large, centered board with high-contrast marks
- Instant bot response after each move
- Futuristic UI styling and neon glow

## Demo

- Local: `http://localhost:8501`
- Online: [https://tictactoe-frin4y82jzpiekrfnvw7xn.streamlit.app/]

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Requirements

- Python 3.10+
- See `requirements.txt`

## How to Run

```bash
streamlit run app.py
```

## How to Play or Usage

- You play as **X**.
- The bot plays as **O**.
- Use the sidebar to adjust difficulty.
- Click **Start Fresh** to reset the match.

## Configuration

- Difficulty is set by the sidebar slider (0–100).
- UI styling can be adjusted in the CSS block inside `app.py`.

## Project Structure

```
.
├── app.py
├── requirements.txt
└── README.md
```

## Key Logic (Excerpt)

The bot blends randomness with strategy. At lower difficulty it makes more "human-ish" mistakes; at higher difficulty it uses minimax more often.

```python
if random.random() > skill:
    return weighted_random_move(board)

if skill < 0.7:
    win_move = find_winning_move(board, "bot")
    if win_move is not None:
        return win_move
    block_move = find_winning_move(board, "human")
    if block_move is not None:
        return block_move
    return weighted_random_move(board)

_, move = minimax(board, "bot")
return move if move is not None else weighted_random_move(board)
```

## Testing

This project does not include automated tests yet.

## Quality and Design Decisions

- Streamlit for fast web UI and deployment.
- Simple state management via `st.session_state`.
- Clean, readable board UI with high contrast.

## Roadmap

- Add difficulty presets (Easy/Medium/Hard)
- Add win animations
- Add a rematch streak tracker

## Limitations

- AI is not perfect at low settings by design.
- No multiplayer mode.

## Contributing

Pull requests are welcome. Open an issue for major changes or feature requests first.
