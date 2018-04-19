import { Component, Input, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare var jQuery: any;

@Component({
    selector: 'huddil-dropdown-component',
    templateUrl: './huddil-dropdown.component.html',
    host: {
        '(document:click)': 'onClickOutside($event)',
    },
    styleUrls: ['./huddil-dropdown.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HuddilDropdownComponent),
            multi: true
        }
    ]
})
export class HuddilDropdownComponent implements ControlValueAccessor {
    @Input() huddilDropdownOptions;
    @Input() huddilDropdownData;

    isShowCustomMenu: boolean;
    selectedItem: any = 'Select City';
    icon: any;
    setting: any;
    selectedItemValue: any;
    data: any;
    randomidHuddilSelect: any;
    randomParentDiv: any;
    randomSelectOptions: any;

    constructor(public el: ElementRef, public domSanitizer: DomSanitizer) { }

    ngOnChanges() {
        this.setting = this.huddilDropdownOptions
        this.selectedItem = this.setting.defaultOption;
        this.data = this.huddilDropdownData;
        this.randomidHuddilSelect = Math.random().toString(36).substring(7);
        this.randomParentDiv = Math.random().toString(36).substring(7);
        this.randomSelectOptions = Math.random().toString(36).substring(7);

        this.icon = this.domSanitizer.bypassSecurityTrustHtml(this.setting.icon);

        if (this.setting.selectedValue != undefined && this.setting.selectedValue != '') {
            if (this.setting.selectedValue == 0) {
                this.selectedItem = this.setting.defaultOption;
            }
            else {

                this.selectedItemValue = this.setting.selectedValue;

                let index = this.data.findIndex(x => x.id == this.setting.selectedValue);

                let selected = index >= 0 ? this.data[index].name : null;

                this.selectedItem = selected;
                //this.writeValue(this.setting.selectedValue);
            }
        }
        else {
            this.selectedItem = this.setting.defaultOption;
        }

    }
    ngAfterViewInit() {
        jQuery('#' + this.randomidHuddilSelect).css("width", this.setting.width);
        jQuery('#' + this.randomParentDiv).css("height", this.setting.height);
        jQuery('#' + this.randomSelectOptions).css("top", this.setting.height);

    }


    // Function to call when the option changes.
    onChange = (option: number) => {

    };

    // Function to call when the input is touched (when a star is clicked).
    onTouched = () => { };


    // Allows Angular to update the model.
    // Update the model and changes needed for the view here.
    writeValue(option: any): void {
        this.onChange(option)

    }

    // Allows Angular to register a function to call when the input has been touched.
    // Save the function as a property to call later here.
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    registerOnChange(fn: (option: any) => void): void {
        this.onChange = fn;
    }


    onClickOutside(event) {
        if (!this.el.nativeElement.contains(event.target)) // similar checks
            this.isShowCustomMenu = false;
    }
    showCustomSelect() {
        this.isShowCustomMenu = !this.isShowCustomMenu;
    }

    selectItem(id, name) {
        this.selectedItem = name;
        this.isShowCustomMenu = false;
        this.selectedItemValue = id;
        this.writeValue(id);

    }
}
