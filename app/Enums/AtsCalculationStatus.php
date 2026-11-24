<?php

namespace App\Enums;

enum AtsCalculationStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Failed = 'failed';
}
