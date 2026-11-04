<?php

namespace App\Console\Commands;

use App\Support\ContentSeeder;
use Illuminate\Console\Command;

class SeedContentCommand extends Command
{
    protected $signature = 'teint:seed {--force : Reecrit les textes des gammes et leurs produits}';

    protected $description = 'Installe le contenu initial (gammes, produits, reglages, compte admin)';

    public function handle(ContentSeeder $seeder): int
    {
        foreach ($seeder->seed((bool) $this->option('force')) as $line) {
            $this->line($line);
        }

        return self::SUCCESS;
    }
}
