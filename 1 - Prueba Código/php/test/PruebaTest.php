<?php

namespace Cbi\Tests;
use \PHPUnit\Framework\TestCase;
use Cbi\tresEnRaya as tresEnRaya;

/**
 *
 */ 
class PruebaTest extends TestCase
{

	public function testFrameworkConfigured()
	{
		$this->assertTrue(true);
	}

	public function setUp()
	{
		$this->ganan_X				= [ tresEnRaya\X , tresEnRaya\X , tresEnRaya\X ]; 
		$this->ganan_O				= [ tresEnRaya\O , tresEnRaya\O , tresEnRaya\O ];
		$this->nadie_gana			= [ tresEnRaya\O , tresEnRaya\X , tresEnRaya\O ];
		$this->nadie_gana_invertido	= [ tresEnRaya\X , tresEnRaya\O , tresEnRaya\X ];

		$this->tablero_pruebas = tresEnRaya\EMPTY_BOARD;
	}

	public function testHayAlgunGanador()
	{
		$this->assertEquals(tresEnRaya\X,			tresEnRaya\is_there_a_winner($this->ganan_X));
		$this->assertEquals(tresEnRaya\O,			tresEnRaya\is_there_a_winner($this->ganan_O));
		$this->assertEquals(tresEnRaya\TIE_GAME,	tresEnRaya\is_there_a_winner($this->nadie_gana));
		$this->assertEquals(tresEnRaya\TIE_GAME,	tresEnRaya\is_there_a_winner($this->nadie_gana_invertido));
	}

	public function testTresEnRaya()
	{
		$this->assertEquals( tresEnRaya\UNFINISHED_GAME, tresEnRaya\boardState($this->tablero_pruebas));

		$this->tablero_pruebas[0] = $this->ganan_X;
		$this->assertEquals(tresEnRaya\X, tresEnRaya\boardState($this->tablero_pruebas));

		$this->tablero_pruebas[0] = $this->ganan_O;
		$this->assertEquals(tresEnRaya\O, tresEnRaya\boardState($this->tablero_pruebas));

		$this->tablero_pruebas = [
			$this->nadie_gana,
			$this->nadie_gana,
			$this->nadie_gana_invertido
		];
		$this->assertEquals(tresEnRaya\TIE_GAME, tresEnRaya\boardState($this->tablero_pruebas));

		$this->tablero_pruebas = tresEnRaya\EMPTY_BOARD;
	}

	public function testSeCompruebanTodasLasLineas()
	{

		$this->tablero_pruebas[0][0] = tresEnRaya\X;
		$this->tablero_pruebas[1][1] = tresEnRaya\X;
		$this->tablero_pruebas[2][2] = tresEnRaya\X;

		$this->assertEquals(tresEnRaya\X, tresEnRaya\boardState($this->tablero_pruebas));
		$this->tablero_pruebas = tresEnRaya\EMPTY_BOARD;

		$this->tablero_pruebas[0][2] = tresEnRaya\O;
		$this->tablero_pruebas[1][1] = tresEnRaya\O;
		$this->tablero_pruebas[2][0] = tresEnRaya\O;

		$this->assertEquals(tresEnRaya\O, tresEnRaya\boardState($this->tablero_pruebas));
		$this->tablero_pruebas = tresEnRaya\EMPTY_BOARD;

		for ($i=0; $i < count($this->tablero_pruebas); $i++)
		{ 
			$this->tablero_pruebas[$i] = $this->ganan_X;
			$this->assertEquals(tresEnRaya\X, tresEnRaya\boardState($this->tablero_pruebas));
			$this->tablero_pruebas[$i] = tresEnRaya\EMPTY_LINE;
		}

		for ($i=0; $i < count($this->tablero_pruebas); $i++) { 
			$this->tablero_pruebas[$i][0]	= tresEnRaya\X;
			$this->tablero_pruebas[$i][1]	= tresEnRaya\X;
			$this->tablero_pruebas[$i][2]	= tresEnRaya\X;

			$this->assertEquals(tresEnRaya\X, tresEnRaya\boardState($this->tablero_pruebas));
			$this->tablero_pruebas = tresEnRaya\EMPTY_BOARD;
		}
	}
}