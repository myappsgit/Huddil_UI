import { Pipe } from '@angular/core';
var ListFilterPipe = /** @class */ (function () {
    function ListFilterPipe() {
    }
    ListFilterPipe.prototype.transform = function (items, filter) {
        var _this = this;
        if (!items || !filter) {
            return items;
        }
        return items.filter(function (item) { return _this.applyFilter(item, filter); });
    };
    ListFilterPipe.prototype.applyFilter = function (item, filter) {
        return !(filter.itemName && item.itemName && item.itemName.toLowerCase().indexOf(filter.itemName.toLowerCase()) === -1);
    };
    ListFilterPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'listFilter',
                    pure: false
                },] },
    ];
    /** @nocollapse */
    ListFilterPipe.ctorParameters = function () { return []; };
    return ListFilterPipe;
}());
export { ListFilterPipe };
//# sourceMappingURL=list-filter.js.map