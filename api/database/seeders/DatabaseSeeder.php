<?php

namespace Database\Seeders;

use App\Support\ContentSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach (app(ContentSeeder::class)->seed(false) as $line) {
            $this->command?->getOutput()->writeln($line);
        }
    }
}
