<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateThesesTableStatusDefault extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('theses', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
        });
    }
    
    public function down()
    {
        Schema::table('theses', function (Blueprint $table) {
            $table->string('status')->default(null)->change();
        });
    }
}
