<?php

namespace App\Enums;

enum EducationLevel: string
{
    case HighSchool = 'high_school';
    case Associates = 'associates';
    case Bachelors = 'bachelors';
    case Masters = 'masters';
    case Doctorate = 'doctorate';
    case NotSpecified = 'not_specified';
}
