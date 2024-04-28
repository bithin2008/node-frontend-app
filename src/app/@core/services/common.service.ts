import { Inject, Injectable, EventEmitter, Output, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { duration } from 'moment';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';

declare var gsap: any;
declare var ScrollTrigger: any;
declare var SplitText: any;

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: 'root'
})

export class CommonService {

  constructor(private titleService: Title, private alertService: AlertService,
    private apiService: ApiService,) {

  }

  showAppLogs = true;
  pData: any;
  globalData: any;
  screenWidth: number | undefined;
  screenHeight: number | undefined;
  screenOrientation: string | undefined;
  screenCaptureObj: any = {};

  @Output() componentLoaded = new EventEmitter<boolean>();
  @Output() issubmitClicked = new EventEmitter<any>();
  @Output() currentStep = new EventEmitter<boolean>();

  @HostListener('window:resize', ['$event'])

  log(msg: any) {
    if (this.showAppLogs === true) {
      console.log(msg);
    }
  }
  warn(msg: any) {
    if (this.showAppLogs === true) {
      console.warn(msg);
    }
  }
  error(msg: any) {
    if (this.showAppLogs === true) {
      console.error(msg);
    }
  }

  scrollToTop() {
    window.document.body.scrollTop = 0;
    window.document.documentElement.scrollTop = 0;
  }
  getScreenPosition() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    return this.screenOrientation = this.screenWidth > this.screenHeight ? 'landscape' : 'portrait';
  }
  getDeviceType() {
    const check = window.navigator.userAgent;
    if (check.match(/Mobile/) && (check.match(/iPhone/) || check.match(/Android/))) {
      console.log('mobile');
      return 'mobile';
    } else if (!check.match(/Mobile/) && (check.match(/Safari/) || check.match(/Chrome/))) {
      console.log('desktop');
      return 'desktop';
    } else {
      console.log('tablet');
      return 'tablet';
    }
  }
  getScreenResolutionBreakPoint(): string {
    const width: number = window.screen.width;
    let screenView = 'xs';
    if (width >= 576 && width < 769) {
      screenView = 'sm';
    } else if (width >= 769 && width < 992) {
      screenView = 'md';
    } else if (width >= 992 && width < 1200) {
      screenView = 'lg';
    } else if (width >= 1200) {
      screenView = 'xl';
    }
    return screenView;
  }

  async verifyreCaptcha(captcha_token:any) {
    return await this.apiService.post(`${AppConfig.apiUrl.common.verifyRecaptcha}`, {captcha_token}).toPromise();
  }
  // getCookieValue(key: string): string | undefined {
  //   const cookie = document.cookie.split(';');
  //   for (let i = 0; i < cookie.length; i++) {

  //     if (cookie[i].trim().startsWith(key)) {
  //       return cookie[i].trim().split(key + '=')[1];
  //     }
  //   }
  // }
  setCookieValue(key: string, value: any) {
    document.cookie = key + '=' + value;
  }

  setUSFormatPhoneNumber(phoneNumber: string) {
    // Remove all non-digit characters from the input
    if (phoneNumber) {
      let number = phoneNumber.replace(/\D/g, '');
      // Apply the desired phone number format
      if (number.length >= 4) {
       number = `(${number.slice(0, 3)}) ${number.slice(3)}`;
      }
      if (number.length >= 10) {

        number = `${number.slice(0, 9)}-${number.slice(9)}`;
      }
      if (number.length >= 5){
        number = `${number.slice(0, 3)}${number.slice(3)}`;

      }
      return number;
    }
    return null
  }

  convertToNormalPhoneNumber(usPhoneNumber: any) {
    if (usPhoneNumber) {
      // Remove all non-numeric characters from the input phone number
      const normalPhoneNumber = usPhoneNumber.replace(/\D/g, '');
      return normalPhoneNumber;
    }
    return null

  }

  getPageDetails(currentRoute:any) {
    if (currentRoute.indexOf('blogs') > -1) {
      currentRoute = currentRoute.replace('blogs/', '');
    }
    return new Promise((resolve, reject) => {
      this.apiService.get(`${AppConfig.apiUrl.common.getPageDetails}?route=${currentRoute ? currentRoute : 'home'}&active_status=1`).subscribe({
        next: (response: any) => {     
          if (response.status == 1 && response.data) {             
            resolve(response.data)
          } 
        }, error: () => {
          reject();
        },
        complete: () => { }
      });
    })  
      
  }

  getTimeAgo(phpTimeStamp: string) {
    const current = new Date().getTime();
    const previous = new Date(Date.parse(phpTimeStamp)).getTime();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
      return Math.round(elapsed / msPerYear) + ' years ago';
    }
  }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  validateFileUpload(fileName: any, fileType: any = []) {
    var allowed_extensions = fileType//new Array('jpg', 'jpeg', 'png');
    var file_extension = fileName.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (allowed_extensions[i] == file_extension) {
        return true; // valid file extension
      }
    }
    return false;
  }
  

  gsapInit(){
    gsap.registerPlugin(ScrollTrigger, SplitText);
    gsap.defaults({ease: "ease"});
   
  }

  gsapTxtRevealAnim(){
  
     setTimeout(() => {
      ScrollTrigger.refresh();

      let textRevealElms = gsap.utils.toArray(".txt-reveal-anim");

      textRevealElms.forEach((textRevealElm:any) => {
        let typeSplit = new SplitText(textRevealElm, {
          types: 'lines, words, chars',
          linesClass: "split-lines",
        })

        gsap.to(textRevealElm, {
          opacity: 1,
          duration: 0.01
        })
        gsap.from(typeSplit.lines, {
          y: '20',
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: ({
            trigger: textRevealElm,
            start: 'top bottom',
            // markers: true
          }),
        })
      });

     }, 1000);
  }


  gsapImgRevealAnim(){
    // ScrollTrigger.refresh();
    
    // let revealContainers = gsap.utils.toArray(".img-reveal-anim");

    // revealContainers.forEach((container:any) => {
    //   let image = container.querySelector("img");
    //   let revealContainersTl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: container,
    //       start: 'top center',
    //       // markers: true
    //     }
    //   });

    //   revealContainersTl.fromTo(container,
    //     {
    //       clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
    //       webkitClipPath: "polygon(0 0, 0 0, 0 0, 0 0)"
    //     },
    //     {
    //       clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    //       webkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    //       duration: 1.5,
    //     }
    //   );
    //   revealContainersTl.from(image, {
    //     scale: 1.1,
    //     duration: 2,
    //   }, 0);
    // });

  }


  gsapBatchAnim(type:any = 'b2t'){
    ScrollTrigger.refresh();

    setTimeout(() => {
      if(type === 'b2t'){
        gsap.set(".batch-anim-b2t > *", {
          y: 10,
          autoAlpha: 0,
        });
    
        ScrollTrigger.batch(".batch-anim-b2t > *", {
          onEnter: (batch:any) => gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.15, 
          }),
        });
      }
    }, 1000);

  }



  gsapBatchB2T(){
    ScrollTrigger.refresh();


    setTimeout(() => {
      gsap.set(".anim--b2t", {
        y: 10,
        autoAlpha: 0,
      });

      ScrollTrigger.batch(".anim--b2t", {
        onEnter: (batch:any) => gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          stagger: 0.15, 
        }),
      });
    }, 1000);

  }



  // gsapTxtRollAnim(){
  //   let txtRollElems = gsap.utils.toArray(".txt-roll-anim");

  //   txtRollElems.forEach((txtRollElem:any) => {
  //     let cloneElem = txtRollElem.firstChild.cloneNode(true);
  //     txtRollElem.append(cloneElem);
      

  //     let txtRollElemTl = gsap.timeline({
  //       defaults: { duration: 0.2, delay: 0, ease: "ease"},
  //       paused: true,
  //       scrollTrigger: {
  //         trigger: txtRollElem,
  //         // start: 'top center',
  //         markers: true
  //       }
  //     });

  //     txtRollElemTl.fromTo(txtRollElem.firstChild,
  //       {
  //         yPercent: 0 
  //       },
  //       {
  //         yPercent: -100,
  //       }
  //     );
  //     txtRollElemTl.fromTo(txtRollElem.lastChild, {
  //         yPercent: 100 
  //       },
  //       {
  //         yPercent: 0,
  //       }
        
  //     );
  //   });

    

  // }
}