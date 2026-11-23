<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Pending = 'pending';
    case Shortlisted = 'shortlisted';
    case Rejected = 'rejected';
    case Hired = 'hired';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Shortlisted => 'Shortlisted',
            self::Rejected => 'Rejected',
            self::Hired => 'Hired',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'blue',
            self::Shortlisted => 'green',
            self::Rejected => 'red',
            self::Hired => 'purple',
        };
    }
}
