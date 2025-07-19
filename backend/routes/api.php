<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MultiplicationController;

Route::get('/multiplication', [MultiplicationController::class, 'getQuestion']);