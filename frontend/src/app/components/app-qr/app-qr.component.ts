import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './app-qr.component.html',
  styleUrl: './app-qr.component.scss',
})
export class AppQrComponent {
  qrCodeURL = 'http://127.0.0.1:4200/register';
  
  constructor() {
    console.log('QR Code URL:', this.qrCodeURL);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.qrCodeURL).then(() => {
      alert('URL copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}
