<?php

namespace App\Enums;

enum ExperienceLevel: string
{
    case EntryLevel = 'entry_level';
    case MidLevel = 'mid_level';
    case SeniorLevel = 'senior_level';
    case Executive = 'executive';
    case NotSpecified = 'not_specified';
}
