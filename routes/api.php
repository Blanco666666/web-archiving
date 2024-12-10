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


Route::post('/auth/register', [RegisterController::class, 'register']); 

// Users route (for authenticated users only)
Route::middleware('auth:api')->get('/users', function (Request $request) {
    return User::all();
});


Route::post('/users', [AuthController::class, 'signup']);
Route::post('/theses/{id}/increment-views', [ThesisController::class, 'incrementViews']);



Route::delete('/users/{id}', function ($id) {
    // Find the user by ID and delete if it exists
    $user = User::find($id);
    if ($user) {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.'], 200);
    } else {
        return response()->json(['message' => 'User not found.'], 404);
    }
});

Route::middleware('auth:api')->put('/users/{id}', function (Request $request, $id) {
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }

    // Update user details
    $user->update([
        'name' => $request->input('name'),
        'email' => $request->input('email'),
        'role' => $request->input('role'),
    ]);

    return response()->json(['message' => 'User updated successfully.'], 200);
});

Route::get('/theses/archive', [ThesisController::class, 'getArchivedTheses']);
Route::put('/theses/{id}/restore', [ThesisController::class, 'restoreThesis']);
Route::delete('/theses/{id}', [ThesisController::class, 'deleteThesis']);

Route::middleware('auth:api')->group(function () {
    Route::delete('/theses/{id}', [ThesisController::class, 'destroy']);
    Route::put('/theses/{id}', [ThesisController::class, 'update']);
    Route::get('/theses', [ThesisController::class, 'index']);
});


Route::get('/theses/statistics', [ThesisController::class, 'getStatistics']);

Route::middleware('auth:api')->group(function () {
    Route::get('/user/profile', [AuthController::class, 'showProfile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
});

Route::post('/users', [AuthController::class, 'store']);

Route::get('/superadmin/thesis-overview', [ThesisController::class, 'getThesisOverview']);

Route::middleware('auth:api')->group(function () {
    Route::get('/rejected-messages', [ThesisController::class, 'getRejectedMessages']);
});

Route::put('/theses/{id}/restore', [ThesisController::class, 'restore']);

Route::get('/superadmin/user-overview', [AuthController::class, 'userOverview']);

Route::post('/user/change-password', [AuthController::class, 'changePassword']);


