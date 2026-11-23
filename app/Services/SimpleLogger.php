<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class SimpleLogger
{
    public function log(string $message, array $context = []): void
    {
        Log::info($message, $context);
    }

    public function error(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }

    public function audit(string $action, string $model, int $modelId, array $changes = []): void
    {
        Log::info('AUDIT', [
            'action' => $action,
            'model' => $model,
            'model_id' => $modelId,
            'user_id' => auth()->id(),
            'changes' => $changes,
            'timestamp' => now()->toDateTimeString(),
        ]);
    }
}
