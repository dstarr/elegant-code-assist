enum Season {
    Fall,
    Winter,
    Spring,
    Summer
  };
  
  let season: Season = Season.Fall;
  console.log(whi chMonths(season));
  
  function whichMonths(season1: Season) {
    let monthsInSeason: string;
    
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
