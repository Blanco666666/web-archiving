<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;
use App\Thesis;

class ThesisController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $query = Thesis::query();
    
        // Search filter
        if ($request->has('search') && $request->search != '') {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('author_name', 'like', '%' . $request->search . '%');
        }
    
        // Year filter
        if ($request->has('years') && $request->years != '') {
            $years = explode(',', $request->years);
            $query->whereIn(DB::raw('YEAR(submission_date)'), $years);
        }
    
        // Filter based on user role
        if ($user->role === 'user') {
            $query->where('status', 'approved'); // Only approved theses for regular users
        } elseif ($user->role === 'admin') {
            $query->whereIn('status', ['approved', 'pending', 'rejected']); // Admin can see approved, pending, and rejected
        } elseif ($user->role === 'superadmin') {
            // Optional: Superadmin sees everything
        }
    
        $theses = $query->get();
        return response()->json($theses);
    }
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'submission_date' => 'required|date',
            'author_name' => 'required|string|max:255',
            'number_of_pages' => 'required|integer',
            'file_path' => 'required|file|mimes:pdf|max:10240', // Ensure the file is a PDF
        ]);
    
        // Check if the file is present and handle the file upload
        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');
            // Store the file and get the path
            $filePath = $file->store('thesis_files', 'public'); // Save in storage/app/public/thesis_files
            $validatedData['file_path'] = $filePath; // Update the path in the validated data
        }
    
        // Create the Thesis entry in the database
        $thesis = Thesis::create($validatedData);
    
        return response()->json([
            'message' => 'Thesis created successfully',
            'thesis' => $thesis
        ], 201);
    }

    public function show($id) {
        $thesis = Thesis::find($id);
        if (!$thesis) {
            return response()->json(['message' => 'Thesis not found.'], 404);
        }
        return response()->json($thesis);
    }

    public function update(Request $request, $id)
    {
        $thesis = Thesis::findOrFail($id);
        $thesis->status = $request->status; // Assuming status is in the request body
        $thesis->save();
    
        return response()->json($thesis, 200);
    }

    public function destroy($id) {
        $thesis = Thesis::findOrFail($id);
        $thesis->delete(); 

        return response()->json(['message' => 'Thesis deleted successfully']);
    }
    public function searchThesis(Request $request)
    {
        $query = Thesis::query();

        // Keyword filter (searching in title or abstract)
        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'like', '%' . $keyword . '%')
                  ->orWhere('abstract', 'like', '%' . $keyword . '%');
            });
        }

        // Year filter (using an array of years)
        if ($request->filled('years') && is_array($request->input('years'))) {
            $years = $request->input('years');
            $query->whereIn('submission_date', $years);
        }

        // Order by the most recent
        $theses = $query->orderBy('submission_date', 'desc')->get();

        return response()->json($theses);

        
    }
    public function edit($id) {
        // Check if the user has the correct role
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Proceed to edit the thesis if authorized
        $thesis = Thesis::findOrFail($id);
        return response()->json($thesis);
    }

    public function approve($id)
    {
        $thesis = Thesis::findOrFail($id);
        $thesis->status = 'approved';
        $thesis->save();
    
        return response()->json(['message' => 'Thesis approved successfully']);
    }
    
    public function reject($id)
    {
        $thesis = Thesis::findOrFail($id);
        $thesis->status = 'rejected';
        $thesis->save();
    
        return response()->json(['message' => 'Thesis rejected successfully']);
    }

}
