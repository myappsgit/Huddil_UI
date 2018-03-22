import { Component, OnInit, OnDestroy } from '@angular/core';
import { HuddilCalendarService } from './huddil-calendar.service';

import { MeetupService } from '../../provider/meetup.service';

declare const $: any;

@Component({
    selector: 'huddil-calendar-component',
    templateUrl: './huddil-calendar.component.html',
    styleUrls: ['./huddil-calendar.component.css']
})
export class HuddilCalendarComponent implements OnInit, OnDestroy {

    name: String;

    events = [];

    facilityId: any;

    // testEvents = [{
    //     title: 'Long Event',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event2',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event3',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event4',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event5',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event5',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event5',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event5',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event5',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },
    // {
    //     title: 'Long Event5',
    //     start: '2018-01-07',
    //     end: '2018-01-10'
    // },

    // ];

    //If loader animation is added, dayview is not displayed properly.
    isCalendarDetailsLoading: boolean;

    sundayOpeningHours = "-";
    mondayOpeningHours = "-";
    tuesdayOpeningHours = "-";
    wednesdayOpeningHours = "-";
    thursdayOpeningHours = "-";
    fridayOpeningHours = "-";
    saturdayOpeningHours = "-";

    descriptionText = "No bookings";
    bookedBySpText = "";
    facilityName: string;

    isItCoWorkingSpace: boolean = false;
    totalSeatsInCoWorkingSpace = 0;

    isItDayView: boolean = true;

    //User Types
    // 5.Admin
    // 6.Advisor
    // 7.Service Provider
    // 8.Consumer

    constructor(public huddilCalendarService: HuddilCalendarService, public meetupService: MeetupService) { }

    ngOnInit() {
        //Gopi: Uncomment
        this.facilityId = this.meetupService.facilityIdForCalendar;
        this.facilityName = this.meetupService.facilityTitleForCalendar;

        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();

        this.initiateFullCalendar();

        // alert("User type:" + this.meetupService.usertype);
    }

    initiateFullCalendar() {

        const $calendar = $('#huddilFullCalendar');

        var mainContext = this;

        // $(document).ready(function(){
        //     alert("Document is ready.");
        // });

        $calendar.fullCalendar({
            viewRender: function (view: any, element: any) {
                // We make sure that we activate the perfect scrollbar when the view isn't on Month
                if (view.name !== 'month') {
                    // const $fc_scroller = $('.fc-scroller');
                    // $fc_scroller.perfectScrollbar();
                }

                mainContext.addBookingEvents();

            },
            header: {
                left: 'prev, next, today',
                center: 'title',
                right: 'month, agendaWeek, agendaDay',
            },
            buttonText: {
                today: 'Today',
                month: 'Month View',
                day: 'Day View',
                week: 'Week View'
            },
            aspectRatio: 2.25, //Default 1.35
            defaultDate: new Date(),
            selectable: true,
            selectHelper: true,
            fixedWeekCount: false,
            editable: false, //Disables dragging
            eventLimit: true, // allow "more" link when too many events
            displayEventTime: false,//We are displaying custom time format

            // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
            //events: this.events,
            views: {
                month: { // name of view
                    titleFormat: 'MMMM YYYY'
                    // other view-specific options here
                },
                week: {
                    titleFormat: ' MMMM D YYYY'
                },
                day: {
                    titleFormat: 'D MMM, YYYY'
                }
            },

            dayClick: function (date, jsEvent, view) {
                $('#huddilFullCalendar').fullCalendar('gotoDate', date);
                $('#huddilFullCalendar').fullCalendar('changeView', 'agendaDay');

                mainContext.isItDayView = true;



                //console.log("Weekday cliked---->" + date.day()); //day of the week: 1 for Monday
                //console.log("Day of the month clicked----->" + date.get('date')); //day of the month
            },

            eventClick: function (calEvent, jsEvent, view) {
                //console.log("calEvent---->" + calEvent.title);
            },
            //Day Heading - For example : 1(date)
            // navLinks: true,
            // navLinkDayClick: function(date, jsEvent) {

            //     alert("adf");
            // }

        });
    }

    // https://ec2-18-216-216-162.us-east-2.compute.amazonaws.com:8443/huddil-1.0.7-BUILD-SNAPSHOT/calendarbookings/?fromTime=2018-01-08%2012%3A00%3A00&facilityId=5
    // "bookingDetails": [
    //     {
    //       "bookingId": 35,
    //       "roomType": "Meeting Room",
    //       "fromTime": "2018-01-22 18:30:00",
    //       "toTime": "2018-01-22 19:00:00",
    //       "seats": 100,
    //       "remainingSeats": 0,
    //       "bookedBySp": 0
    //     }
    //   ]

    addBookingEvents() {


        var moment = $('#huddilFullCalendar').fullCalendar('getDate');

        let dateOfTheMonthDisplayed = moment.format();

        let dateString = dateOfTheMonthDisplayed.replace('T', " ");


        if (dateString.length < 11) {
            dateString = dateString + " 00:00:00";
        }

        let isOnline: boolean = navigator.onLine;

        // if (isOnline == false) {
        //     alert("You are offline. Please check your network.");
        // } else {
        this.isCalendarDetailsLoading = true;
        this.huddilCalendarService.getCalendarBookings(this.facilityId, dateString).subscribe(res => {
            let responsecode = res.headers.get('responsecode');
            //console.log("ResponseCode:" + responsecode);

            this.isCalendarDetailsLoading = false;

            if (responsecode == "2101") {
                let data = JSON.parse(res.text());
                this.addDataToCalendar(data);
            } else if (responsecode == "2102") {

                this.meetupService.popupMessage = "Booking Details Read Failure.";
                this.meetupService.isWarningPopup = true;
                this.meetupService.isShowPopup = true;
            }
        }, (error) => {
            //this.isCalendarDetailsLoading = false;
            if (error.status == 500) {
                this.meetupService.popupMessage = "Internal Server Error";
                this.meetupService.isShowPopup = true;
                this.meetupService.isWarningPopup = true;
            } else if (error.status == 400) {
                this.meetupService.isWarningPopup = true;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = "Bad Request";
            } else if (error.status == 401) {
                this.meetupService.isWarningPopup = true;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = "Unauthorized";
            } else if (error.status == 403) {
                this.meetupService.isWarningPopup = true;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = "Forbidden";
            } else if (error.status == 404) {
                this.meetupService.isWarningPopup = true;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = "Not Found";
            } else {
                this.meetupService.isWarningPopup = true;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = 'Something went wrong in server.';
            }
        });

        // }

    }

    addDataToCalendar(data) {
        let openingTimings = data.timing;
        let bookingDetails = data.bookingDetails;

        $('#huddilFullCalendar').fullCalendar('removeEvents');
        this.bookedBySpText = "";
        this.descriptionText = "No Bookings";


        let title, startTime, endTime, className;

        bookingDetails.forEach(element => {

            startTime = this.formatAMPM(element.fromTime);
            endTime = this.formatAMPM(element.toTime);



            if (element.roomType == "Co-Working Space") {
                // title = "Total Seats:" + element.seats + "-Remaining Seats:" + element.remainingSeats;


                // if (element.seats == "1") {
                //     title = "Booked - " + element.seats + " Seat";
                // } else {
                //     title = "Booked - " + element.seats + " Seats";
                // }

                title = "Booked - " + element.bookedSeats + " Seats";

                //className = "event-azure";

                this.isItCoWorkingSpace = true;
                this.totalSeatsInCoWorkingSpace = element.bookedSeats + element.remainingSeats;
                this.descriptionText = "Booked seats"
            } else {
                title = startTime + "-" + endTime;
                //className = "event-red";

                this.isItCoWorkingSpace = false;

                this.descriptionText = "Booked times"
            }




            //TO DO- CHECK IF THE USER IS NOT CONSUMER - START

            let colorString = "#3b91ad";


            if (element.bookedBySp == 0) {

                colorString = "#3b91ad";
            } else {
                this.bookedBySpText = "Booked by Service Provider";
                colorString = "#ff0000";
            }

            let event = {
                title: title,
                start: new Date(element.fromTime),
                end: new Date(element.toTime),
                //className: className,
                color: colorString
            };

            // $('#huddilFullCalendar').fullCalendar( 'rerenderEvents' );
            $('#huddilFullCalendar').fullCalendar('renderEvent', event, true);

            //TO DO- CHECK IF THE USER IS NOT CONSUMER - END



        });

        openingTimings.forEach(element => {
            if (element.weekDay == 1) {
                if (element.openingTime == "00:00:00" && element.closingTime == "00:00:00") {
                    this.sundayOpeningHours = "Closed"
                } else {
                    this.sundayOpeningHours = "Opening Hours: " + this.timeAmpm(element.openingTime) + "-" + this.timeAmpm(element.closingTime);
                }
            } else if (element.weekDay == 2) {
                if (element.openingTime == "00:00:00" && element.closingTime == "00:00:00") {
                    this.mondayOpeningHours = "Closed"
                } else {
                    this.mondayOpeningHours = "Opening Hours: " + this.timeAmpm(element.openingTime) + "-" + this.timeAmpm(element.closingTime);
                }
            } else if (element.weekDay == 3) {
                if (element.openingTime == "00:00:00" && element.closingTime == "00:00:00") {
                    this.tuesdayOpeningHours = "Closed"
                } else {
                    this.tuesdayOpeningHours = "Opening Hours: " + this.timeAmpm(element.openingTime) + "-" + this.timeAmpm(element.closingTime);
                }
            } else if (element.weekDay == 4) {
                if (element.openingTime == "00:00:00" && element.closingTime == "00:00:00") {
                    this.wednesdayOpeningHours = "Closed"
                } else {
                    this.wednesdayOpeningHours = "Opening Hours: " + this.timeAmpm(element.openingTime) + "-" + this.timeAmpm(element.closingTime);
                }
            } else if (element.weekDay == 5) {
                if (element.openingTime == "00:00:00" && element.closingTime == "00:00:00") {
                    this.thursdayOpeningHours = "Closed"
                } else {
                    this.thursdayOpeningHours = "Opening Hours: " + this.timeAmpm(element.openingTime) + "-" + this.timeAmpm(element.closingTime);
                }
            } else if (element.weekDay == 6) {
                if (element.openingTime == "00:00:00" && element.closingTime == "00:00:00") {
                    this.fridayOpeningHours = "Closed"
                } else {
                    this.fridayOpeningHours = "Opening Hours: " + this.timeAmpm(element.openingTime) + "-" + this.timeAmpm(element.closingTime);
                }
            } else if (element.weekDay == 7) {
                if (element.openingTime == "00:00:00" && element.closingTime == "00:00:00") {
                    this.saturdayOpeningHours = "Closed"
                } else {
                    this.saturdayOpeningHours = "Opening Hours: " + this.timeAmpm(element.openingTime) + "-" + this.timeAmpm(element.closingTime);
                }
            }

        });

    }


    formatAMPM(dateParam) {
        let date = new Date(dateParam);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let minutesStr = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutesStr + '' + ampm;
        return strTime;
    }

    timeAmpm(time) {


        //Gopi:Commented to avoid - Opening Hours: 08:00am-Closed. Expected Result: Opening Hours: 08:00am-12:00am
        // if (time == "00:00:00") {
        //     return "Closed";
        // } else {
        if (time.value !== "") {
            var hours = time.split(":")[0];
            var minutes = time.split(":")[1];
            var suffix = hours >= 12 ? "pm" : "am";
            hours = hours % 12 || 12;
            hours = hours < 10 ? "0" + hours : hours;

            var displayTime = hours + ":" + minutes + "" + suffix;
            return displayTime;
        }
        // }

    }

    normalSpace() {
        this.facilityId = 1;
        this.addBookingEvents();
    }

    coWorkingSpace() {
        this.facilityId = 6;
        this.addBookingEvents();

        $('#huddilFullCalendar').fullCalendar({ dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] });
    }

    closePopup() {
        this.meetupService.isShowPopup = false;
        this.meetupService.popupMessage = '';
    }

    ngOnDestroy() {

    }

}
