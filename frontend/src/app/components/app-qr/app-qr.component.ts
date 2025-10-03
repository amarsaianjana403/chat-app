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
  qrCodeURL = 'http://10.118.26.198:4200/register';
}
