<?php

namespace Cbi\tresEnRaya;
/*
    Vamos a crear un juego de tres en raya y necesitamos controlar el estado del
    tablero. Para ello, crearemos una función.

    Supongamos que el tablero viene en la forma de un array de 3x3, en el que
    el valor es 0 si la casilla está vacía, 1 si es una X y 2 si es una O, tal
    que así:

    [[0,0,1],
     [0,1,2],
     [2,1,0]]

    Lo que queremos es que nuestra función devuelva -1 si el tablero no está
    resuelto, 1 si han ganado las X, 2 si han ganado las O y 0 en caso de
    empate.

    Supondremos que el tablero que se pasa como entrada siempre es válido, dado
    que estamos dentro del contexto de nuestro juego.
*/

const X               =    1;
const O               =    2;
const EMPTY_CELL      =    0;
const TIE_GAME        =    0;
const UNFINISHED_GAME =   -1;
const NEEDED_POINTS   =    3;

const EMPTY_LINE	= [ EMPTY_CELL, EMPTY_CELL, EMPTY_CELL ];
const EMPTY_BOARD	= [
	EMPTY_LINE,
	EMPTY_LINE,
	EMPTY_LINE
];

function is_there_a_winner(array $line): int
{
        return array_search(NEEDED_POINTS, array_count_values($line));
}

function boardState(array $board): int
{
    $empty_cells = false;
    $diagonals = [
        [ $board[0][0], $board[1][1], $board[2][2] ],
        [ $board[0][2], $board[1][1], $board[2][0] ]
    ];

    for ($i=0; $i < count($board); $i++)
    { 
        $column_is_winner = is_there_a_winner(array_column($board, $i));
		if ($column_is_winner) { return $column_is_winner; }

        $row_is_winner = is_there_a_winner($board[$i]);
        if ($row_is_winner) { return $row_is_winner; }
        
        if($i < count($diagonals))
        {
            $diagonal_is_winner = is_there_a_winner($diagonals[$i]);
            if ($diagonal_is_winner) { return $diagonal_is_winner; }
        }
		
        if(!$empty_cells)
        {
            $empty_cells = in_array(EMPTY_CELL, $board[$i]);
        }
    }

    return ($empty_cells) ? UNFINISHED_GAME : TIE_GAME;
}
