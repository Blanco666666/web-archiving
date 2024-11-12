<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Thesis extends Model
{
    protected $fillable = [
        'title', 'abstract', 'submission_date', 'author_name', 'number_of_pages', 'file_path',
    ];
}

