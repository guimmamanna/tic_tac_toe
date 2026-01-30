export type CellValue = 'X' | 'O' | '';
export type Board = CellValue[];
export type GameMode = 'CLASSIC' | 'SPEED' | 'ULTIMATE' | 'POWERUP' | 'AI';
export type GameStatus = 'WAITING' | 'ACTIVE' | 'FINISHED' | 'ABANDONED';
export type Player = 'X' | 'O';
export interface Move {
    position: number;
    player: Player;
    timestamp: number;
}
export interface GameState {
    id: string;
    roomCode?: string;
    mode: GameMode;
    status: GameStatus;
    board: Board;
    currentTurn: Player;
    winner?: Player | 'draw';
    player1Id?: string;
    player2Id?: string;
    moves: Move[];
    createdAt: string;
    timeLimit?: number;
    powerUps?: PowerUp[];
}
export interface PowerUp {
    type: 'BLOCK' | 'EXTRA_TURN' | 'SWAP';
    player: Player;
    used: boolean;
}
export interface GameResult {
    winner: Player | 'draw' | null;
    winningLine?: number[];
}
export interface ServerToClientEvents {
    'game:state': (state: GameState) => void;
    'game:move': (move: Move) => void;
    'game:end': (result: GameResult) => void;
    'game:error': (error: string) => void;
    'room:joined': (roomCode: string) => void;
    'room:playerJoined': (playerId: string) => void;
    'room:playerLeft': (playerId: string) => void;
    'chat:message': (message: ChatMessage) => void;
    'matchmaking:found': (gameId: string) => void;
}
export interface ClientToServerEvents {
    'game:join': (roomCode: string) => void;
    'game:create': (mode: GameMode) => void;
    'game:move': (position: number) => void;
    'game:usePowerUp': (powerUp: PowerUp['type']) => void;
    'game:rematch': () => void;
    'matchmaking:join': () => void;
    'matchmaking:leave': () => void;
    'chat:send': (message: string) => void;
}
export interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    message: string;
    timestamp: number;
    type: 'TEXT' | 'EMOJI' | 'SYSTEM';
}
export declare const WIN_LINES: number[][];
//# sourceMappingURL=game.d.ts.map