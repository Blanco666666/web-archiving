<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ThesisController; 
use App\Http\Controllers\Auth\RegisterController;
use App\Thesis;
use App\User;

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

// Authenticated routes
Route::middleware('auth:api')->prefix('theses')->group(function () {
    Route::get('/', [ThesisController::class, 'index']);
    Route::get('/{id}', [ThesisController::class, 'show']);
    Route::post('/', [ThesisController::class, 'store']);
    Route::get('/pending', [ThesisController::class, 'getPendingTheses']);
    Route::put('/{id}/approve', [ThesisController::class, 'approve']);
    Route::put('/{id}/reject', [ThesisController::class, 'reject']);
});

// Role-based middleware (admin, superadmin)
Route::middleware('role:admin,superadmin')->group(function () {
    Route::delete('/theses/{id}', [ThesisController::class, 'destroy']); 
});

Route::post('/auth/register', [RegisterController::class, 'register']); 

// Users route (for authenticated users only)
Route::middleware('auth:api')->get('/users', function (Request $request) {
    return User::all();
});


Route::post('/users', [AuthController::class, 'signup']);
Route::post('/theses/{id}/increment-views', [ThesisController::class, 'incrementViews']);
