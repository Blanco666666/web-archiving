<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThesesTable extends Migration
{
    public function up()
    {
        Schema::create('theses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('abstract'); 
            $table->date('submission_date'); 
            $table->string('author_name');
            $table->string('number_of_pages');
            $table->string('file_path'); 
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending'); // Thesis status
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('theses');
    }
}   

