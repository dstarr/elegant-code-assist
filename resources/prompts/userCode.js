"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Season;
(function (Season) {
    Season[Season["Fall"] = 0] = "Fall";
    Season[Season["Winter"] = 1] = "Winter";
    Season[Season["Spring"] = 2] = "Spring";
    Season[Season["Summer"] = 3] = "Summer";
})(Season || (Season = {}));
;
let season = Season.Fall;
console.log(whichMonths(season));
function whichMonths(season1) {
    let monthsInSeason;
    switch (season1) {
        case Season.Fall:
            monthsInSeason = "September to November";
            break;
        case Season.Winter:
            monthsInSeason = "December to February";
            break;
        case Season.Spring:
            monthsInSeason = "March to May";
            break;
        case Season.Summer:
            monthsInSeason = "June to August";
        default:
            monthsInSeason = "Invalid season";
            break;
    }
    return monthsInSeason;
}
//# sourceMappingURL=userCode.js.map