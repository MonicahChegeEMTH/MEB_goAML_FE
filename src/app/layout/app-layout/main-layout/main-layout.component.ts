import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';
import { DirectionService } from 'src/app/core/service/direction.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  direction: string;
  public config: any = {};
  isOpenSidebar: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private directoryService: DirectionService,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService
  ) {
    this.directoryService.currentData.subscribe((currentData) => {
      if (currentData) {
        this.direction = currentData;
      } else {
        if (localStorage.getItem('isRtl')) {
          if (localStorage.getItem('isRtl') === 'true') {
            this.direction = 'rtl';
          } else if (localStorage.getItem('isRtl') === 'false') {
            this.direction = 'ltr';
          }
        } else {
          if (this.config.layout.rtl == true) {
            this.direction = 'rtl';
          } else {
            this.direction = 'ltr';
          }
        }
      }
    });
  }

  callSidemenuCollapse() {
    this.isOpenSidebar = !this.isOpenSidebar;

    if (this.isOpenSidebar) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.renderer.removeClass(this.document.body, 'ls-closed');
      localStorage.setItem('sidebar_status', 'open');
    } else {
      this.closeSidebar();
    }

    console.log(
      'Sidebar toggled:',
      this.isOpenSidebar,
      this.document.body.classList
    );
  }

  ngOnInit() {
    const mediaQuery = window.matchMedia('(min-width: 1030px)');
    mediaQuery.addEventListener('change', () =>
      this.onResize(new Event('matchMediaChange'))
    );
    this.config = this.configService.configData;
  }

  ngAfterViewInit() {
    this.initializeSidebarState();
    this.onResize(new Event('init'));
  }

  initializeSidebarState() {
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(this.document.body, localStorage.getItem('theme'));
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }

    if (localStorage.getItem('menuOption')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menuOption')
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'menu_' + this.config.layout.sidebar.backgroundColor
      );
    }

    if (localStorage.getItem('choose_logoheader')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_logoheader')
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'logo-' + this.config.layout.logo_bg_color
      );
    }

    const isDesktop = window.innerWidth >= 1030;
    const sidebarStatus = localStorage.getItem('sidebar_status');

    if (isDesktop) {
      // Always show sidebar on desktop
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.renderer.removeClass(this.document.body, 'ls-closed');
      this.isOpenSidebar = true;
      localStorage.setItem('sidebar_status', 'open');
    } else {
      // Mobile/Tablet: Sidebar closed by default
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.isOpenSidebar = false;
      if (sidebarStatus === 'open') {
        this.renderer.removeClass(this.document.body, 'side-closed');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
        this.isOpenSidebar = true;
      }
    }
  }

  callFullscreen() {
    const docElm = document.documentElement;

    // Check if the document is currently in fullscreen mode
    if (
      !document.fullscreenElement &&
      !(document as any).webkitFullscreenElement &&
      !(document as any).mozFullScreenElement &&
      !(document as any).msFullscreenElement
    ) {
      // Request fullscreen
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if ((docElm as any).webkitRequestFullscreen) {
        (docElm as any).webkitRequestFullscreen();
      } else if ((docElm as any).mozRequestFullScreen) {
        (docElm as any).mozRequestFullScreen();
      } else if ((docElm as any).msRequestFullscreen) {
        (docElm as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }

  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const sidebarEl = this.document.querySelector('.sidebar');
    const menuButton =
      this.elementRef.nativeElement.querySelector('.sidemenu-collapse');

    if (
      this.isOpenSidebar &&
      sidebarEl &&
      !sidebarEl.contains(event.target as Node) &&
      !menuButton.contains(event.target as Node) &&
      window.innerWidth < 1030 // Close on click outside for mobile and tablet
    ) {
      this.closeSidebar();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = window.innerWidth;

    if (width >= 1030) {
      // Ensure sidebar visible on full screen
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.isOpenSidebar = true;
    } else {
      // Hide sidebar by default on small screens
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.isOpenSidebar = false;
    }
  }

  closeSidebar() {
    if (window.innerWidth < 1030) {
      // Include tablet devices (up to 1029px)
      this.isOpenSidebar = false;
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.renderer.addClass(this.document.body, 'ls-closed');
      localStorage.setItem('sidebar_status', 'close');
    }
  }
}
