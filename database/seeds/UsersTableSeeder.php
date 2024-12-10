

<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Clear existing users
        User::truncate();

        // Insert sample users
        User::insert([
            ['name' => 'John Doe', 'email' => 'john@example.com', 'department' => 'Computer Science', 'password' => bcrypt('password')],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'department' => 'Computer Science', 'password' => bcrypt('password')],
            ['name' => 'Bob Brown', 'email' => 'bob@example.com', 'department' => 'Business Administration', 'password' => bcrypt('password')],
            ['name' => 'Alice Green', 'email' => 'alice@example.com', 'department' => 'Arts and Science Program', 'password' => bcrypt('password')],
            ['name' => 'Charlie Blue', 'email' => 'charlie@example.com', 'department' => 'Nursing Program', 'password' => bcrypt('password')],
        ]);
    }
}
