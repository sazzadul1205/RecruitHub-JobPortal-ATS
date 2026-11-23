<?php

namespace App\Enums;

enum ApplicantCvStatus: string
{
    case Pending = 'pending';
    case Active = 'active';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Active => 'Active',
        };
    }
}
