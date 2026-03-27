import { Component, Input, OnInit, inject } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AvatarComponent,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  SidebarToggleDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgTemplateOutlet,
    RouterLink,
    AvatarComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    HeaderComponent,
    HeaderNavComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
  ],
})
export class DefaultHeaderComponent implements OnInit {
  @Input() sidebarId: string = 'sidebar1';

  private authService = inject(AuthService);
  userRole: string = '';

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
  }
}