<?php

namespace App\Services;

use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Support\Str;
use Smalot\PdfParser\Parser;

class ATSService
{
    public function calculate(Application $application): array
    {
        $jobListing = JobListing::find($application->job_listing_id);

        $keywords = $jobListing?->keywords ?? [];

        if (empty($keywords)) {
            return $this->result(0, [], [], 0, 0, 'No keywords defined for this job.');
        }

        $resumeText = $this->extractText($application->resume_path);

        if (trim($resumeText) === '') {
            return $this->result(0, [], $keywords, 0, count($keywords), 'No text could be extracted from the resume.');
        }

        $text = mb_strtolower($resumeText);
        $matched = [];
        $missing = [];

        foreach ($keywords as $keyword) {
            $keyword = trim((string) $keyword);
            if ($keyword === '') {
                continue;
            }
            if ($this->matches($text, $keyword)) {
                $matched[] = $keyword;
            } else {
                $missing[] = $keyword;
            }
        }

        $total = count(array_filter($keywords, fn ($k) => trim((string) $k) !== ''));
        $matchedCount = count($matched);
        $percentage = $total > 0 ? round(($matchedCount / $total) * 100, 2) : 0;

        return $this->result(
            $percentage,
            array_slice($matched, 0, 10),
            array_slice($missing, 0, 10),
            $matchedCount,
            $total,
            $this->levelMessage($percentage)
        );
    }

    protected function matches(string $text, string $keyword): bool
    {
        $keyword = preg_quote($keyword, '/');
        if (str_contains($keyword, ' ')) {
            return (bool) mb_strpos($text, mb_strtolower($keyword)) !== false;
        }

        return (bool) preg_match(
            '/(?<![\p{L}\p{N}])'.$keyword.'(?![\p{L}\p{N}])/ui',
            $text
        );
    }

    protected function extractText(string $path): string
    {
        $extension = Str::lower(pathinfo($path, PATHINFO_EXTENSION));

        return match ($extension) {
            'pdf' => $this->extractPdf($path),
            'docx' => $this->extractDocx($path),
            'doc' => $this->extractDoc($path),
            default => file_exists($path) ? file_get_contents($path) : '',
        };
    }

    protected function extractPdf(string $path): string
    {
        if (! file_exists($path)) {
            return '';
        }

        if (class_exists(Parser::class)) {
            try {
                $parser = new Parser;
                $document = $parser->parseFile($path);

                return $document->getText() ?? '';
            } catch (\Throwable $e) {
                // fall through to fallback
            }
        }

        return $this->runCommand('pdftotext', [$path, '-']);
    }

    protected function extractDocx(string $path): string
    {
        if (! file_exists($path) || ! class_exists(\ZipArchive::class)) {
            return '';
        }

        try {
            $zip = new \ZipArchive;
            if ($zip->open($path) !== true) {
                return '';
            }

            $document = $zip->getFromName('word/document.xml');
            $zip->close();

            if ($document === false || $document === null) {
                return '';
            }

            return strip_tags((string) $document);
        } catch (\Throwable $e) {
            return '';
        }
    }

    protected function extractDoc(string $path): string
    {
        if (! file_exists($path)) {
            return '';
        }

        return $this->runCommand('antiword', [$path]);
    }

    protected function runCommand(string $command, array $args): string
    {
        if (! function_exists('exec')) {
            return '';
        }

        $escapedArgs = array_map(fn ($arg) => escapeshellarg((string) $arg), $args);
        $full = implode(' ', array_merge([$command], $escapedArgs));

        exec($full.' 2>&1', $output, $returnCode);

        return $returnCode === 0 ? implode("\n", $output) : '';
    }

    protected function result(float $percentage, array $matched, array $missing, int $matchedCount, int $total, string $message): array
    {
        $level = $this->level($percentage);

        return [
            'percentage' => $percentage,
            'matched_keywords' => $matched,
            'missing_keywords' => $missing,
            'matched_count' => $matchedCount,
            'total_keywords' => $total,
            'extracted_skills' => [],
            'extracted_experience_years' => 0,
            'extracted_education' => 'Not specified',
            'analysis' => [
                'level' => $level,
                'message' => $message,
                'color' => $this->color($level),
                'matched_count' => $matchedCount,
                'missing_count' => count($missing),
                'top_matched' => array_slice($matched, 0, 10),
                'top_missing' => array_slice($missing, 0, 10),
                'suggestions' => $this->suggestions($missing),
            ],
            'calculated_at' => now()->toDateTimeString(),
        ];
    }

    protected function level(float $percentage): string
    {
        if ($percentage >= 80) {
            return 'Excellent';
        }

        if ($percentage >= 60) {
            return 'Good';
        }

        if ($percentage >= 40) {
            return 'Fair';
        }

        return 'Needs improvement';
    }

    protected function color(string $level): string
    {
        return match ($level) {
            'Excellent' => 'green',
            'Good' => 'blue',
            'Fair' => 'yellow',
            default => 'red',
        };
    }

    protected function levelMessage(float $percentage): string
    {
        return match (true) {
            $percentage >= 80 => 'Your resume matches many key requirements.',
            $percentage >= 60 => 'Your resume matches several key requirements.',
            $percentage >= 40 => 'Your resume matches some key requirements.',
            default => 'Your resume matches few key requirements.',
        };
    }

    protected function suggestions(array $missing): array
    {
        $suggestions = [];

        if (! empty($missing)) {
            $suggestions[] = 'Highlight these keywords: '.implode(', ', array_slice($missing, 0, 5));
        }

        $suggestions[] = 'Consider adding a skills section';

        return $suggestions;
    }
}
