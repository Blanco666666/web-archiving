<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        require_once __DIR__ . '/UserSeeder.php';

$this->call(UserSeeder::class);
    }
}
