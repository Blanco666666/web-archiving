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
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('author_name', 'like', '%' . $request->search . '%');
            });
        }
    
        // Year filter
        if ($request->filled('years')) {
            $years = explode(',', $request->years);
            $query->whereIn(DB::raw('YEAR(submission_date)'), $years);
        }
    
        // Role-based filtering
        switch ($user->role) {
            case 'user':
                $query->where('status', 'approved'); // Only approved theses
                break;
            case 'admin':
                $query->whereIn('status', ['approved', 'pending', 'rejected']);
                break;
            case 'superadmin':
                // Superadmin sees all theses
                break;
        }
    
        return response()->json($query->get());
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'submission_date' => 'required|date',
            'author_name' => 'required|string', // Expect a JSON string
            'number_of_pages' => 'required|integer|min:1',
            'file_path' => 'required|mimes:pdf|max:10240',
            'abstract_file' => 'nullable|mimes:pdf|max:10240',
            'keywords' => 'nullable|string',
        ]);
    
        // Decode the JSON string to ensure it's valid and consistent
        $authorNames = json_decode($request->input('author_name'), true);
        if (!is_array($authorNames)) {
            return response()->json(['error' => 'Invalid author_name format'], 400);
        }
    
        // Store the thesis
        $filePath = $request->file('file_path')->store('theses', 'public');
        $abstractFilePath = $request->hasFile('abstract_file')
            ? $request->file('abstract_file')->store('abstracts', 'public')
            : null;
    
        $thesis = Thesis::create([
            'title' => $request->input('title'),
            'abstract' => $request->input('abstract'),
            'submission_date' => $request->input('submission_date'),
            'author_name' => json_encode($authorNames), // Store as a JSON string
            'number_of_pages' => $request->input('number_of_pages'),
            'file_path' => $filePath,
            'abstract_file_path' => $abstractFilePath,
            'keywords' => $request->input('keywords'),
        ]);
    
        return response()->json(['message' => 'Thesis submitted successfully!', 'thesis' => $thesis], 201);
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

    public function destroy($id)
    {
        $thesis = Thesis::find($id);
    
        if (!$thesis) {
            return response()->json(['error' => 'Thesis not found'], 404);
        }
    
        $thesis->delete();
    
        return response()->json(['message' => 'Thesis deleted successfully'], 200);
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

    public function incrementViews($id)
    {
        // Find the thesis by ID
        $thesis = Thesis::findOrFail($id);
    
        // Increment the views
        $thesis->views += 1;
        $thesis->save();
    
        // Return success response
        return response()->json([
            'message' => 'View count incremented',
            'views' => $thesis->views
        ], 200);
    }
}


