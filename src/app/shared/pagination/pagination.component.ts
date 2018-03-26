import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';

declare var jQuery: any;

@Component({
    selector: 'pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: ['pagination.component.css']
})

export class PaginationComponent {
    @Input() currentPage;
    @Input() totalPaginationTabs;
    @Output() displayPage_Output = new EventEmitter();

    totalRecords = [];
    disabledRight: boolean;
    disabledLeft: boolean;
    pager: number = 0;
    doNotLoad: boolean;
    cameBackFirstPage: boolean;
    constructor(public meetupService: MeetupService) {

    }

    ngOnChanges() {
        // var self = this;
        //this.createTabs();
        if (this.currentPage == 1) {
            jQuery('#pagination').twbsPagination('destroy');
        }
        this.jqueryFunction();

    }
    jqueryFunction() {
        var self = this;

        jQuery(function () {
            //alert(self.totalPaginationTabs);
            var obj = jQuery('#pagination').twbsPagination({
                totalPages: self.totalPaginationTabs,
                visiblePages: 5,

                onPageClick: function (event, page) {
                    // console.log(event);
                    self.openpage(page);
                }
            });
            //jQuery('#pagination').twbsPagination().getPages(self.currentPage);
        });
    }
    openpage(page) {

        this.meetupService.currentPaginationPage = page;
        this.meetupService.totalRecordsPagination = this.totalPaginationTabs;
        // if (page == 1 && !this.cameBackFirstPage) {
        //     this.doNotLoad = true;
        // }
        // else if (page > 1) {
        //     this.doNotLoad = false;
        //     this.cameBackFirstPage = true;
        // }
        // if (!this.doNotLoad) {

        this.displayPage_Output.emit(page);
        //}
    }
    // displayPages(page) {
    //     this.disabledRight = false;
    //     this.disabledLeft = false;
    //     if (page == this.totalPaginationTabs) {
    //         this.disabledRight = true;
    //     }
    //     else if (page == 1) {

    //         this.disabledLeft = true;
    //     }
    //     this.displayPage_Output.emit(page);
    //     this.createTabs();
    // }
    // createTabs() {

    //     this.totalRecords = [];
    //     for (var i = 1; i <= this.totalPaginationTabs; i++) {
    //         this.totalRecords.push([{ 'number': i, 'active': i == this.currentPage ? true : false }]);
    //     }

    // }
    // goPre() {

    //     let page = this.currentPage - 1;

    //     this.disabledRight = false;
    //     this.disabledLeft = false;
    //     if (page == this.totalPaginationTabs) {
    //         this.disabledRight = true;
    //     }
    //     else if (page == 1) {

    //         this.disabledLeft = true;
    //     }

    //     if (page > 0) {
    //         this.displayPage_Output.emit(page);
    //     }

    // }
    // goNext() {
    //     let page = this.currentPage + 1;
    //     this.disabledRight = false;
    //     this.disabledLeft = false;
    //     if (page == this.totalPaginationTabs) {
    //         this.disabledRight = true;
    //     }
    //     else if (page == 1) {
    //         this.disabledLeft = true;
    //     }
    //     if (page <= this.totalPaginationTabs) {
    //         this.displayPage_Output.emit(page);
    //     }
    // }


}