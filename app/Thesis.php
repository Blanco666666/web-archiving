<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Thesis extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'title', 'abstract', 'submission_date', 'author_name', 'number_of_pages', 'file_path', 'status', 'abstract_file_path',
        'keywords',
    ];
}

