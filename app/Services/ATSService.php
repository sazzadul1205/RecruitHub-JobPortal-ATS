<?php

namespace App\Services;

use App\Enums\ATSCalculationStatus;
use App\Models\Application;
use Smalot\PdfParser\Parser as PdfParser;
use ZipArchive;

class ATSService
{
    public function calculate(Application $application): void
    {
        $application->update([
            'ats_calculation_status' => ATSCalculationStatus::Processing->value,
            'ats_attempt_count' => $application->ats_attempt_count + 1,
            'ats_last_attempted_at' => now(),
        ]);

        try {
            $job = $application->jobListing;
            $keywords = $job->keywords ?? [];

            if (empty($keywords)) {
                $application->update([
                    'ats_calculation_status' => ATSCalculationStatus::Completed->value,
                    'ats_score' => $this->emptyScore(0, 0),
                    'ats_percentage' => 0,
                ]);
                return;
            }

            $resumeText = $this->extractText($application);

            if (trim($resumeText) === '') {
                $application->update([
                    'ats_calculation_status' => ATSCalculationStatus::Failed->value,
                    'ats_score' => [
                        'percentage' => 0,
                        'matched_keywords' => [],
                        'missing_keywords' => array_map('strtolower', $keywords),
                        'matched_count' => 0,
                        'total_keywords' => count($keywords),
                        'analysis' => [
                            'level' => 'Needs improvement',
                            'message' => 'No text could be extracted from the resume.',
                            'color' => 'red',
                        ],
                    ],
                    'ats_percentage' => 0,
                ]);
                return;
            }

            $normalizedKeywords = array_map(fn ($k) => mb_strtolower(trim($k)), $keywords);
            $matched = [];
            $missing = [];

            foreach ($normalizedKeywords as $keyword) {
                if ($this->keywordMatches($keyword, $resumeText)) {
                    $matched[] = $keyword;
                } else {
                    $missing[] = $keyword;
                }
            }

            $total = count($normalizedKeywords);
            $matchedCount = count($matched);
            $percentage = $total > 0 ? round(($matchedCount / $total) * 100, 2) : 0;

            $level = $this->getLevel($percentage);

            $atsScore = [
                'percentage' => $percentage,
                'matched_keywords' => array_slice($matched, 0, 10),
                'missing_keywords' => array_slice($missing, 0, 10),
                'matched_count' => $matchedCount,
                'total_keywords' => $total,
                'extracted_skills' => [],
                'extracted_experience_years' => 0,
                'extracted_education' => 'Not specified',
                'analysis' => [
                    'level' => $level['label'],
                    'message' => $level['message'],
                    'color' => $level['color'],
                    'matched_count' => $matchedCount,
                    'missing_count' => count($missing),
                    'top_matched' => array_slice($matched, 0, 5),
                    'top_missing' => array_slice($missing, 0, 5),
                    'suggestions' => $this->getSuggestions($missing),
                ],
                'calculated_at' => now()->toDateTimeString(),
            ];

            $application->update([
                'ats_calculation_status' => ATSCalculationStatus::Completed->value,
                'ats_score' => $atsScore,
                'matched_keywords' => $matched,
                'missing_keywords' => $missing,
                'ats_percentage' => $percentage,
            ]);
        } catch (\Throwable $e) {
            \Log::error('ATS calculation failed', [
                'application_id' => $application->id,
                'error' => $e->getMessage(),
            ]);

            $application->update([
                'ats_calculation_status' => ATSCalculationStatus::Failed->value,
            ]);
        }
    }

    private function extractText(Application $application): string
    {
        $resumePath = $application->resume_path;

        if (!$resumePath || !\Storage::disk('private')->exists($resumePath)) {
            return '';
        }

        $fullPath = \Storage::disk('private')->path($resumePath);
        $extension = strtolower(pathinfo($resumePath, PATHINFO_EXTENSION));

        return match ($extension) {
            'pdf' => $this->extractPdfText($fullPath),
            'docx' => $this->extractDocxText($fullPath),
            'doc' => $this->extractDocText($fullPath),
            default => file_get_contents($fullPath),
        };
    }

    private function extractPdfText(string $path): string
    {
        try {
            $parser = new PdfParser();
            $document = $parser->parseFile($path);
            return $document->getText() ?? '';
        } catch (\Throwable $e) {
            \Log::warning('PDF parser failed, trying pdftotext', ['path' => $path, 'error' => $e->getMessage()]);

            $output = shell_exec("pdftotext '" . escapeshellarg($path) . "' - 2>/dev/null");
            return $output ?? '';
        }
    }

    private function extractDocxText(string $path): string
    {
        try {
            $zip = new ZipArchive;
            if ($zip->open($path) === true) {
                $xml = $zip->getFromName('word/document.xml');
                $zip->close();

                if ($xml) {
                    $text = strip_tags($xml);
                    return mb_convert_encoding($text, 'UTF-8', 'UTF-8');
                }
            }
        } catch (\Throwable $e) {
            \Log::warning('DOCX extraction failed', ['path' => $path, 'error' => $e->getMessage()]);
        }

        return '';
    }

    private function extractDocText(string $path): string
    {
        try {
            $output = shell_exec("antiword '" . escapeshellarg($path) . "' 2>/dev/null");
            if ($output) {
                return $output;
            }
        } catch (\Throwable $e) {
            \Log::warning('antiword failed', ['path' => $path, 'error' => $e->getMessage()]);
        }

        try {
            return file_get_contents($path);
        } catch (\Throwable $e) {
            return '';
        }
    }

    private function keywordMatches(string $keyword, string $text): bool
    {
        $lowerText = mb_strtolower($text);

        if (str_contains($keyword, ' ')) {
            return mb_strpos($lowerText, $keyword) !== false;
        }

        $pattern = '/(?<![\p{L}\p{N}])' . preg_quote($keyword, '/') . '(?![\p{L}\p{N}])/u';
        return (bool) preg_match($pattern, $lowerText);
    }

    private function getLevel(float $percentage): array
    {
        return match (true) {
            $percentage >= 80 => ['label' => 'Excellent', 'message' => 'Your resume matches most key requirements.', 'color' => 'green'],
            $percentage >= 60 => ['label' => 'Good', 'message' => 'Your resume matches many key requirements.', 'color' => 'blue'],
            $percentage >= 40 => ['label' => 'Fair', 'message' => 'Your resume matches some key requirements.', 'color' => 'yellow'],
            default => ['label' => 'Needs improvement', 'message' => 'Your resume matches few key requirements. Consider adding missing skills.', 'color' => 'red'],
        };
    }

    private function getSuggestions(array $missing): array
    {
        $suggestions = [];

        if (!empty($missing)) {
            $suggestions[] = 'Highlight these keywords: ' . implode(', ', array_slice($missing, 0, 5));
            $suggestions[] = 'Consider adding a skills section to your resume';
        }

        return $suggestions;
    }

    private function emptyScore(int $matched, int $total): array
    {
        return [
            'percentage' => 0,
            'matched_keywords' => [],
            'missing_keywords' => [],
            'matched_count' => $matched,
            'total_keywords' => $total,
            'extracted_skills' => [],
            'extracted_experience_years' => 0,
            'extracted_education' => 'Not specified',
            'analysis' => [
                'level' => 'Needs improvement',
                'message' => 'No keywords defined for this job.',
                'color' => 'gray',
                'matched_count' => $matched,
                'missing_count' => 0,
                'top_matched' => [],
                'top_missing' => [],
                'suggestions' => ['Ask the employer to add keywords to the job listing.'],
            ],
            'calculated_at' => now()->toDateTimeString(),
        ];
    }
}
