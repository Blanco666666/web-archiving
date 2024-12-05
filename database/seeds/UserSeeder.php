<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Superadmin User
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('superadminpassword'),
            'role' => 'superadmin',
            'full_name' => 'Super Admin User',
            'course' => null,
            'department' => null,
            'id_number' => 'SA001',
        ]);

        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('adminpassword'),
            'role' => 'admin',
            'full_name' => 'Admin User',
            'course' => null,
            'department' => 'Admin Department',
            'id_number' => 'AD001',
        ]);

        // Regular User
        User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('userpassword'),
            'role' => 'user',
            'full_name' => 'Regular User',
            'course' => 'Example Course',
            'department' => 'Example Department',
            'id_number' => 'RU001',
        ]);
    }
}
