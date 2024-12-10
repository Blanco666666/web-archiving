<?php

use Illuminate\Database\Seeder;
use App\Department; // Use the newly created Department model

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            'Computer Studies Program',
            'Business Administration Program',
            'Arts and Science Program',
            'Nursing Program',
            'Criminal Justice',
            'Education Program',
            'Accountancy Program',
            'Teachers Education Program',
            'Engineering and Technology Program',
        ];

        foreach ($departments as $department) {
            Department::create(['name' => $department]);
        }
    }
}
