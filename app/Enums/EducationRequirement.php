<?php

namespace App\Enums;

enum EducationRequirement: string
{
    case HighSchool = 'high_school';
    case Diploma = 'diploma';
    case Bachelors = 'bachelors';
    case Masters = 'masters';
    case Phd = 'phd';
    case None = 'none';

    public function label(): string
    {
        return match ($this) {
            self::HighSchool => 'High School',
            self::Diploma => 'Diploma',
            self::Bachelors => "Bachelor's Degree",
            self::Masters => "Master's Degree",
            self::Phd => 'PhD',
            self::None => 'Not Specified',
        };
    }
}
