import os
import random
import time
from typing import List, Optional, Tuple, Union

import streamlit as st

LLM_NAMES = [
    "Claude",
    "ChatGPT",
    "Codex",
    "Gemini",
    "Llama",
    "Mistral",
    "Perplexity",
    "Bard",
    "Phi",
    "Grok",
]

BOARD_TEMPLATE = ["" for _ in range(9)]
WIN_LINES = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]

LOVE_MESSAGES = [
    "sparks fly",
    "heartbeats sync",
    "cosmic match",
    "soft giggles",
    "love.exe running",
    "circuit crush",
]



def new_bot_name() -> str:
    return random.choice(LLM_NAMES)


Line = Union[Tuple[int, int, int], Tuple[()]]


def check_winner(board: List[str]) -> Optional[Tuple[str, Line]]:
    for a, b, c in WIN_LINES:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a], (a, b, c)
    if all(cell for cell in board):
        return "draw", ()
    return None


def available_moves(board: List[str]) -> List[int]:
    return [i for i, cell in enumerate(board) if not cell]


def weighted_random_move(board: List[str]) -> int:
    open_spots = available_moves(board)
    if not open_spots:
        return -1
    weights = []
    for idx in open_spots:
        if idx == 4:
            weights.append(3)
        elif idx in (0, 2, 6, 8):
            weights.append(2)
        else:
            weights.append(1)
    return random.choices(open_spots, weights=weights, k=1)[0]


def find_winning_move(board: List[str], player: str) -> Optional[int]:
    for a, b, c in WIN_LINES:
        line = [board[a], board[b], board[c]]
        if line.count(player) == 2 and line.count("") == 1:
            if board[a] == "":
                return a
            if board[b] == "":
                return b
            if board[c] == "":
                return c
    return None


def minimax(board: List[str], turn: str) -> Tuple[int, Optional[int]]:
    result = check_winner(board)
    if result:
        winner, _ = result
        if winner == "bot":
            return 1, None
        if winner == "human":
            return -1, None
        return 0, None

    if turn == "bot":
        best_score = -2
        best_move = None
        for move in available_moves(board):
            board[move] = "bot"
            score, _ = minimax(board, "human")
            board[move] = ""
            if score > best_score:
                best_score = score
                best_move = move
        return best_score, best_move

    best_score = 2
    best_move = None
    for move in available_moves(board):
        board[move] = "human"
        score, _ = minimax(board, "bot")
        board[move] = ""
        if score < best_score:
            best_score = score
            best_move = move
    return best_score, best_move


def bot_pick(board: List[str], difficulty: int) -> int:
    if not available_moves(board):
        return -1
    skill = difficulty / 100
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


def reset_game() -> None:
    st.session_state.board = BOARD_TEMPLATE.copy()
    st.session_state.turn = "human"
    st.session_state.winner = None
    st.session_state.line = ()
    st.session_state.bot_name = new_bot_name()
    st.session_state.human_score = st.session_state.get("human_score", 0)
    st.session_state.bot_score = st.session_state.get("bot_score", 0)
    st.session_state.draws = st.session_state.get("draws", 0)
    st.session_state.spark = random.choice(LOVE_MESSAGES)
    st.session_state.setdefault("difficulty", 60)
    st.session_state.setdefault("background_style", "Nebula Black")


def award_points(result: str) -> None:
    if result == "human":
        st.session_state.human_score += 1
    elif result == "bot":
        st.session_state.bot_score += 1
    else:
        st.session_state.draws += 1


def render_board() -> None:
    board = st.session_state.board
    cols = st.columns(3)
    for idx in range(9):
        with cols[idx % 3]:
            cell = board[idx]
            if cell == "human":
                label = "X"
            elif cell == "bot":
                label = "O"
            else:
                label = " "
            disabled = (
                bool(cell)
                or st.session_state.winner is not None
                or st.session_state.turn != "human"
            )
            st.button(
                label,
                key=f"cell-{idx}",
                use_container_width=True,
                disabled=disabled,
                on_click=handle_human_move,
                args=(idx,),
            )


def render_status() -> None:
    winner = st.session_state.winner
    if winner == "human":
        st.success(f"You win! {st.session_state.spark} ✨")
    elif winner == "bot":
        st.error(f"{st.session_state.bot_name} wins. {st.session_state.spark} 💔")
    elif winner == "draw":
        st.info(f"Draw — {st.session_state.spark} 💫")
    else:
        turn_label = "You" if st.session_state.turn == "human" else st.session_state.bot_name
        st.markdown(
            f'<div class="turn-indicator">Turn: {turn_label}</div>',
            unsafe_allow_html=True,
        )


def render_duel_icons() -> None:
    human_svg = """
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" aria-label="Human">
      <circle cx="60" cy="36" r="22" fill="#e7f9ff"/>
      <rect x="35" y="62" width="50" height="70" rx="18" fill="#e7f9ff"/>
      <rect x="20" y="72" width="18" height="60" rx="9" fill="#e7f9ff"/>
      <rect x="82" y="72" width="18" height="60" rx="9" fill="#e7f9ff"/>
    </svg>
    """
    robot_svg = """
    <svg viewBox="0 0 140 160" xmlns="http://www.w3.org/2000/svg" aria-label="Robot">
      <rect x="25" y="40" width="90" height="80" rx="18" fill="#e7f9ff"/>
      <rect x="50" y="15" width="40" height="20" rx="10" fill="#e7f9ff"/>
      <rect x="55" y="0" width="30" height="12" rx="6" fill="#e7f9ff"/>
      <circle cx="55" cy="75" r="10" fill="#0a0b12"/>
      <circle cx="85" cy="75" r="10" fill="#0a0b12"/>
      <rect x="48" y="98" width="44" height="10" rx="5" fill="#0a0b12"/>
      <rect x="10" y="55" width="15" height="50" rx="7" fill="#e7f9ff"/>
      <rect x="115" y="55" width="15" height="50" rx="7" fill="#e7f9ff"/>
    </svg>
    """
    cols = st.columns([1, 2, 1])
    with cols[0]:
        st.markdown(f'<div class="icon-wrap">{human_svg}<div class="icon-label">Human</div></div>', unsafe_allow_html=True)
    with cols[2]:
        st.markdown(f'<div class="icon-wrap">{robot_svg}<div class="icon-label">AI Bot</div></div>', unsafe_allow_html=True)


def maybe_bot_move() -> None:
    if st.session_state.turn != "bot" or st.session_state.winner is not None:
        return
    if not available_moves(st.session_state.board):
        return
    # Immediate bot response after the human move.
    move = bot_pick(st.session_state.board, st.session_state.get("difficulty", 60))
    if move == -1:
        return
    st.session_state.board[move] = "bot"
    st.session_state.turn = "human"
    st.session_state.spark = random.choice(LOVE_MESSAGES)


def handle_human_move(idx: int) -> None:
    board = st.session_state.board
    if board[idx] or st.session_state.winner is not None:
        return
    if st.session_state.turn != "human":
        return
    board[idx] = "human"
    st.session_state.turn = "bot"
    st.session_state.spark = random.choice(LOVE_MESSAGES)
    apply_game_logic()
    if st.session_state.winner is None:
        maybe_bot_move()
        apply_game_logic()


def apply_game_logic() -> None:
    result = check_winner(st.session_state.board)
    if result:
        winner, line = result
        if winner == "draw":
            st.session_state.winner = "draw"
            st.session_state.line = ()
            award_points("draw")
        else:
            st.session_state.winner = winner
            st.session_state.line = line
            award_points(winner)


def main() -> None:
    st.set_page_config(page_title="Love Tic Tac Toe", page_icon="💞", layout="centered")
    st.session_state.setdefault("difficulty", 60)
    background_style = "#0a0f1a"
    mark_color = "#ffffff"
    st.markdown(
        """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Space+Grotesk:wght@400;600&display=swap');
        :root {{
            --glow: rgba(0, 255, 198, 0.35);
            --accent: #12f7d6;
            --mark: {mark_color};
        }}
        .stApp {{
            background: {background};
            background-attachment: fixed;
            position: relative;
            min-height: 100vh;
            color: #e7f9ff;
        }}
        [data-testid="stHeader"] {{
            background: transparent;
        }}
        .block-container {{
            padding-top: 1.2rem;
            padding-bottom: 2rem;
            position: relative;
            z-index: 1;
        }}
        .hero {{
            text-align: center;
            margin-top: 0.5rem;
            margin-bottom: 3rem;
        }}
        .board-wrap {{
            max-width: 520px;
            margin: 5rem auto 0 auto;
        }}
        .board-stack {{
            min-height: auto;
            display: block;
        }}
        [data-testid="column"] > div {{
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            box-shadow: 0 0 24px rgba(18, 247, 214, 0.08);
            padding: 6px;
        }}
        .stButton>button {{
            border: 1px solid rgba(18, 247, 214, 0.35);
            border-radius: 12px;
            background: rgba(7, 12, 22, 0.8);
            color: #ffffff;
            font-family: 'Orbitron', sans-serif;
            font-size: 2.6rem;
            font-weight: 700;
            text-shadow: 0 0 18px rgba(255, 255, 255, 0.9);
            height: 6rem;
            transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
            box-shadow: 0 0 18px rgba(18, 247, 214, 0.15);
        }}
        .stButton>button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 0 30px var(--glow);
            border-color: rgba(18, 247, 214, 0.7);
        }}
        .stButton>button:disabled {{
            opacity: 0.6;
            box-shadow: none;
        }}
        .love-title {{
            font-size: 2.6rem;
            font-weight: 700;
            text-align: center;
            animation: pulse 3s ease-in-out infinite;
            font-family: 'Orbitron', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.15rem;
            color: #e7f9ff;
            text-shadow: 0 0 18px rgba(18, 247, 214, 0.35);
        }}
        .love-subtitle {{
            text-align: center;
            color: #9bb0cc;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.1rem;
            margin-top: 5rem;
        }}
        .start-fresh .stButton>button {{
            position: relative;
            width: 150px;
            height: 30px;
            border-radius: 45px;
            border: none;
            background-color: rgb(151, 95, 255);
            color: #ffffff;
            box-shadow: 0px 10px 10px rgb(210, 187, 253) inset,
                0px 5px 10px rgba(5, 5, 5, 0.212),
                0px -10px 10px rgb(124, 54, 255) inset;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.95rem;
            font-weight: 700;
            text-shadow: none;
        }}
        .start-fresh .stButton>button::before {{
            width: 70%;
            height: 2px;
            position: absolute;
            background-color: rgba(250, 250, 250, 0.678);
            content: "";
            filter: blur(1px);
            top: 7px;
            border-radius: 50%;
        }}
        .start-fresh .stButton>button::after {{
            width: 70%;
            height: 2px;
            position: absolute;
            background-color: rgba(250, 250, 250, 0.137);
            content: "";
            filter: blur(1px);
            bottom: 7px;
            border-radius: 50%;
        }}
        .start-fresh .stButton>button:hover {{
            animation: jello-horizontal 0.9s both;
        }}
        @keyframes jello-horizontal {{
            0% {{ transform: scale3d(1, 1, 1); }}
            30% {{ transform: scale3d(1.25, 0.75, 1); }}
            40% {{ transform: scale3d(0.75, 1.25, 1); }}
            50% {{ transform: scale3d(1.15, 0.85, 1); }}
            65% {{ transform: scale3d(0.95, 1.05, 1); }}
            75% {{ transform: scale3d(1.05, 0.95, 1); }}
            100% {{ transform: scale3d(1, 1, 1); }}
        }}
        .turn-indicator {{
            text-align: center;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.6rem;
            letter-spacing: 0.08rem;
            color: #e7f9ff;
            max-width: 520px;
            margin: 1.5rem auto 0 auto;
        }}
        .icon-wrap {{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;
        }}
        .icon-wrap svg {{
            width: 90px;
            height: 120px;
            filter: drop-shadow(0 0 8px rgba(18, 247, 214, 0.25));
        }}
        .icon-label {{
            font-family: 'Orbitron', sans-serif;
            font-size: 0.9rem;
            color: #9bb0cc;
            letter-spacing: 0.08rem;
        }}
        @keyframes pulse {{
            0% {{ transform: scale(1); }}
            50% {{ transform: scale(1.03); }}
            100% {{ transform: scale(1); }}
        }}
        </style>
        """.format(background=background_style, mark_color=mark_color),
        unsafe_allow_html=True,
    )
    st.markdown('<div class="hero">', unsafe_allow_html=True)
    st.markdown('<div class="love-title">💞 Love Tic Tac Toe</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="love-subtitle">Human hearts vs. random LLM romantics. Win their circuitry.</div>',
        unsafe_allow_html=True,
    )
    st.markdown("</div>", unsafe_allow_html=True)

    if "board" not in st.session_state:
        reset_game()

    with st.sidebar:
        st.subheader("Match Settings")
        st.markdown('<div class="start-fresh">', unsafe_allow_html=True)
        if st.button("Start Fresh"):
            reset_game()
        st.markdown("</div>", unsafe_allow_html=True)
        st.slider("Bot difficulty", 0, 100, key="difficulty")
        st.markdown(f"**Opponent:** {st.session_state.bot_name}")
        st.markdown("**Mood:** " + st.session_state.spark)
        st.divider()
        st.markdown("**Scoreboard**")
        st.markdown(f"You: {st.session_state.human_score}")
        st.markdown(f"{st.session_state.bot_name}: {st.session_state.bot_score}")
        st.markdown(f"Draws: {st.session_state.draws}")

    render_status()
    render_duel_icons()
    st.markdown('<div class="board-stack">', unsafe_allow_html=True)
    st.markdown('<div class="board-wrap">', unsafe_allow_html=True)
    render_board()
    st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    apply_game_logic()
    if st.session_state.turn == "bot" and st.session_state.winner is None:
        maybe_bot_move()
        apply_game_logic()

    if st.session_state.winner:
        if st.button("Play again"):
            reset_game()


if __name__ == "__main__":
    main()
