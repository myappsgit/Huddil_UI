import { Component, Input } from '@angular/core';
import { getNearBy } from '../../../assets/js/customMap.js';

import { MeetupService } from '../../provider/meetup.service';

declare var jQuery: any;

@Component({
    selector: 'image-slider',
    templateUrl: './image-slider.component.html',
    styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {
    @Input() moduleName;
    @Input() facilitiyPhotos;

    noImageFound: boolean;
    sliderReady: boolean = false;
    facilitiPhotos: any = [];
    facilitiPhotos1: any = ['assets/noThumbFound.png', 'assets/noThumbFound.png', 'assets/noThumbFound.png', 'assets/noThumbFound.png', 'assets/noThumbFound.png'];


    constructor(public meetupService: MeetupService) { }

    ngOnInit() {
        this.getFacilityPhotos();




    }
    getFacilityPhotos() {

        this.facilitiyPhotos.forEach(photo => {
            this.meetupService.downloadFacilitiesPhotos(photo.imgPath).subscribe(response => {

                this.createImageFromBlob(response);


            },
                (error) => {


                    this.noImageFound = true;
                });

        });

        this.sliderReady = true;

        this.loadSlider();

    }
    loadSlider() {
        setTimeout(function () {

            //------------------trent's slider
            let $offset = jQuery('.trent-slider').width();
            let $tSlideInStyles = { left: '0', right: '0' }
            let $t_loadBarStopStyles = { animation: "none", width: "0%" }
            let $hiddenSlideStylesRight = { left: $offset, right: 0 - $offset }
            let $hiddenSlideStylesLeft = { right: $offset, left: 0 - $offset }

            //slider functions
            function tStartLoadBar() { jQuery('.t-load-bar .inner-load-bar').css('animation', 'load 4.5s linear infinite'); }

            function tSliderHasStopped() {
                if (jQuery('.current-t-slide').css('left') === "0px" && jQuery('.current-t-slide').css('right') === "0px") {
                    return true;
                } else {
                    return false;
                }
            }

            function tSlideChangerRight() {
                if (jQuery('.current-t-slide').next().hasClass('t-slide') && tSliderHasStopped()) {
                    jQuery('.current-t-slide').removeClass('current-t-slide').css($hiddenSlideStylesLeft).next().css($tSlideInStyles).addClass('current-t-slide');
                    jQuery('.current-dot').removeClass('current-dot').next().addClass('current-dot');
                } else if (tSliderHasStopped()) {
                    jQuery('.current-t-slide').removeClass('current-t-slide');
                    jQuery('.t-slide').first().addClass('current-t-slide').css($tSlideInStyles);
                    tSetCss();
                    jQuery('.current-dot').removeClass('current-dot')
                    jQuery('.t-dot').first().addClass('current-dot');
                }
            }
            function tSlideChangerLeft() {
                if (jQuery('.current-t-slide').prev().hasClass('t-slide') && tSliderHasStopped()) {
                    jQuery('.current-t-slide').removeClass('current-t-slide').css($hiddenSlideStylesRight).prev().css($tSlideInStyles).addClass('current-t-slide');
                    jQuery('.current-dot').removeClass('current-dot').prev().addClass('current-dot');
                } else if (tSliderHasStopped()) {
                    jQuery('.current-t-slide').removeClass('current-t-slide');
                    jQuery('.t-slide').last().addClass('current-t-slide').css($tSlideInStyles);
                    tSetCssLeft();
                    jQuery('.current-dot').removeClass('current-dot')
                    jQuery('.t-dot').last().addClass('current-dot');
                }
            }

            function tSetCss() {
                jQuery('.t-slide').each(function (index, value) {
                    if (index > 0) {
                        jQuery(this).css($hiddenSlideStylesRight);
                    }
                });
            }
            function tSetCssLeft() {
                let $t_total = jQuery('.t-slide').length - 1;
                jQuery('.t-slide').each(function (index, value) {
                    if (index < $t_total) {
                        jQuery(this).css($hiddenSlideStylesLeft)
                    }
                });
            }


            //populate dots for every slide
            jQuery('.t-slide').each(function (index, value) {

                jQuery('.t-slide-dots').append('<div class="t-dot"></div>');
                if (index === 0) { jQuery('.t-dot').first().addClass('current-dot') }
            });

            //slider-code
            jQuery('.trent-slider').css('height', jQuery('.trent-slider').width() / 2);
            tSetCss();
            //load bar 
            tStartLoadBar();
            jQuery('.trent-slider').hover(function () { jQuery('.t-load-bar .inner-load-bar').css($t_loadBarStopStyles); }, function () { tStartLoadBar() })
            //interval sllide change
            var tSlideChange = window.setInterval(function () {
                tSlideChangerRight();
            }, 4500);
            jQuery('.trent-slider').mouseover(function () {
                clearInterval(tSlideChange);
            }).mouseout(function () {
                tSlideChange = window.setInterval(function () {
                    tSlideChangerRight();
                }, 4500);
            });

            // -----slider controls
            //arrow
            jQuery('.t-slider-controls .arrow').click(function () {
                if (jQuery(this).hasClass('rightArrow')) { tSlideChangerRight(); }
                else if (jQuery(this).hasClass('leftArrow')) { tSlideChangerLeft(); }
            });
            //dots 
            jQuery('.t-slide-dots .t-dot').click(function () {
                let $newDotIndex = jQuery(this).index();
                let $currentDotIndex = jQuery('.current-dot').index();
                if (tSliderHasStopped()) {
                    jQuery('.t-slide').each(function (index, value) {
                        jQuery('.current-dot').removeClass('current-dot');
                        jQuery('.current-t-slide').removeClass('current-t-slide');
                        jQuery('.t-dot').eq($newDotIndex).addClass('current-dot');
                        jQuery('.t-slide').eq($newDotIndex).css($tSlideInStyles).addClass('current-t-slide');
                        if (index > $newDotIndex) {
                            jQuery(this).css($hiddenSlideStylesRight);
                        } else if (index < $newDotIndex) {
                            jQuery(this).css($hiddenSlideStylesLeft);
                        }
                    });
                }
            });
            //close slider JS


        }, 1000);
    }
    createImageFromBlob(image: Blob) {
        let imageToShow: any;
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            imageToShow = reader.result;
            this.facilitiPhotos.push(imageToShow);

        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }


    }

}
