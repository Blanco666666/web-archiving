<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ThesisController; 
use App\Http\Controllers\Auth\RegisterController;

/*
|--------------------------------------------------------------------------
// API Routes
|--------------------------------------------------------------------------
// Register API routes for your application. 
*/


Route::prefix('auth')->group(function () {
    Route::post('signup', [AuthController::class, 'signup']); 
    Route::post('login', [AuthController::class, 'login']); 

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']); 
        Route::get('user', [AuthController::class, 'user']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('/theses', [ThesisController::class, 'index']); 
    Route::get('/theses/{id}', [ThesisController::class, 'show']); 
    Route::post('/theses', [ThesisController::class, 'store']); 
    Route::get('theses/pending', [ThesisController::class, 'getPendingTheses']); 
    Route::put('theses/{id}/approve', 'ThesisController@approve');
    Route::put('theses/{id}/reject', 'ThesisController@reject');
    Route::put('/theses/{thesis}', [ThesisController::class, 'update']);

});

    Route::middleware('role:admin,superadmin')->group(function () {
        Route::put('/theses/{id}', [ThesisController::class, 'update']); 
        Route::delete('/theses/{id}', [ThesisController::class, 'destroy']); 
    });
Route::post('/auth/register', [RegisterController::class, 'register']); 


