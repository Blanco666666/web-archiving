<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToThesesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('theses', function (Blueprint $table) {
            $table->softDeletes(); // This will add the 'deleted_at' column
        });
    }
    
    public function down()
    {
        Schema::table('theses', function (Blueprint $table) {
            $table->dropSoftDeletes(); // To remove the 'deleted_at' column if needed
        });
    }
}
