<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfiguracionCorreo extends Mailable
{
    use Queueable, SerializesModels;
    public $information;
 
    public function __construct( $information)
    {
        $this->information = $information;
    }
    // ConfiguracionCorreos
    public function build()
    {
        return $this->subject($this->information->Detalle)
            ->view('ConfiguracionCorreos', [
                'information' => $this->information,
            ]);
    }
}
