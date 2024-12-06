<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Validator;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        // Validate request input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role
        ]);
    
        $token = $user->createToken('Personal Access Token')->accessToken;
    
        return response()->json([
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        // Validate the request input
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        // Authenticate user by email and password
        $user = User::where('email', $request->email)->first();
    
        if ($user && Hash::check($request->password, $user->password)) {
            // Create access token
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->accessToken;
    
            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role, // Include the role in the response
                ],
            ], 200);
        } else {
            Log::warning('Unauthorized login attempt', [
                'email' => $request->email,
            ]);
    
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }

    public function user(Request $request)
    {
        if ($request->user()) {
            return response()->json($request->user());
        } else {
            return response()->json(['error' => 'No authenticated user'], 401);
        }
    }
    public function show(Request $request)
    {
        return response()->json($request->user());
    }
    public function index()
    {
        return response()->json(User::all());
    }

    public function showProfile(Request $request)
    {
        $user = $request->user();
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
    
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'id_number' => 'required|string|max:255',
        ]);
    
        $user->update($validated);
    
        return response()->json(['message' => 'Profile updated successfully!', 'user' => $user]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string|in:user,admin,superadmin',
            'password' => 'required|string|min:8',
        ]);
    
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'role' => $validatedData['role'],
            'password' => bcrypt($validatedData['password']),
        ]);
    
        return response()->json($user, 201);
    }
    
}

