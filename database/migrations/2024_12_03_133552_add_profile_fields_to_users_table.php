<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProfileFieldsToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('full_name')->nullable(); // Full Name
            $table->string('course')->nullable(); // Course
            $table->string('department')->nullable(); // Department
            $table->string('id_number')->nullable(); // ID Number
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['full_name', 'course', 'department', 'id_number']);
        });
    }
}

