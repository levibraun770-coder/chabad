(function () {
  "use strict";

  var holidays = [
    {id:"rosh-hashanah",name:"Rosh Hashanah",label:"Rosh Hashanah",description:"Services<br />Dinner<br />Shofar &amp; Lunch",learnDescription:"Rosh Hashanah prayers, customs, and holiday resources.",href:"/7489168",month:["Tishri","Tishrei"],day:1,duration:2},
    {id:"yom-kippur",name:"Yom Kippur",label:"Yom Kippur",description:"Kol Nidrei<br />Services<br />Neilah &amp; Break-Fast",learnDescription:"Yom Kippur prayers, customs, and holiday resources.",href:"/7489168",month:["Tishri","Tishrei"],day:10,duration:1},
    {id:"sukkot",name:"Sukkot & Simchat Torah",label:"Tishrei",description:"Programs, meals, services, and practical info for celebrating in Bologna.",learnDescription:"Programs, meals, services, and practical info.",href:"/7520823",month:["Tishri","Tishrei"],day:15,duration:9},
    {id:"chanukah",name:"Chanukah",label:"Kislev–Tevet",description:"Menorah lighting, customs, stories, recipes, and holiday resources.",learnDescription:"Menorah lighting, customs, stories, recipes, and holiday resources.",href:"/holidays/chanukah/default_cdo/jewish/Hanukkah.htm",month:["Kislev"],day:25,duration:8},
    {id:"purim",name:"Purim",label:"Adar",description:"Megillah, mitzvot, customs, stories, and Purim resources.",learnDescription:"Megillah, mitzvot, customs, stories, and Purim resources.",href:"/library/article_cdo/aid/638040/jewish/Purim.htm",month:["Adar","Adar II"],day:14,duration:1},
    {id:"pesach",name:"Pesach",label:"Nissan",description:"Seder, chametz, customs, recipes, and Pesach resources.",learnDescription:"Seder, chametz, customs, recipes, and Pesach resources.",href:"/holidays/passover/default_cdo/jewish/Passover-Pesach.htm",month:["Nisan","Nissan"],day:15,duration:8},
    {id:"shavuot",name:"Shavuot",label:"Sivan",description:"The giving of the Torah, customs, learning, and holiday resources.",learnDescription:"The giving of the Torah, customs, learning, and holiday resources.",href:"/library/article_cdo/aid/111377/jewish/Shavuot.htm",month:["Sivan"],day:6,duration:2}
  ];

  function hebrewParts(date, formatter) {
    var result = {};
    formatter.formatToParts(date).forEach(function (part) {
      if (part.type === "day" || part.type === "month" || part.type === "year") result[part.type] = part.value;
    });
    return {day:Number(result.day),month:result.month,year:result.year};
  }

  function findRelevantOccurrence(definition, fromDate, toDate, formatter, today) {
    var cursor = new Date(fromDate);
    while (cursor <= toDate) {
      var hp = hebrewParts(cursor, formatter);
      if (hp.day === definition.day && definition.month.indexOf(hp.month) !== -1) {
        var start = new Date(cursor);
        start.setDate(start.getDate() - 1);
        var end = new Date(start);
        end.setDate(end.getDate() + definition.duration);
        var dayAfterEnd = new Date(end);
        dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);
        if (dayAfterEnd > today) return {definition:definition,start:start,end:end,hyear:hp.year};
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return null;
  }

  function formatRange(start, end) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var sameYear = start.getFullYear() === end.getFullYear();
    if (sameYear && start.getMonth() === end.getMonth()) return months[start.getMonth()]+" "+start.getDate()+"–"+end.getDate()+", "+end.getFullYear();
    if (sameYear) return months[start.getMonth()]+" "+start.getDate()+"–"+months[end.getMonth()]+" "+end.getDate()+", "+end.getFullYear();
    return months[start.getMonth()]+" "+start.getDate()+", "+start.getFullYear()+"–"+months[end.getMonth()]+" "+end.getDate()+", "+end.getFullYear();
  }

  function comingCard(occurrence) {
    var def = occurrence.definition;
    return '<div class="cob-upcoming-card"><p class="cob-kicker" style="color:#ef8a20;">'+formatRange(occurrence.start,occurrence.end)+'</p><h2>'+def.name+'</h2><p class="cob-upcoming-date">'+def.label+(occurrence.hyear?" "+occurrence.hyear:"")+'</p><p>'+def.description+'</p><p style="margin-top:16px!important;"><a class="cob-button" href="'+def.href+'">View information &rarr;</a></p></div>';
  }

  function regularCard(def) {
    return '<div class="cob-card"><h3>'+def.name+'</h3><p>'+def.learnDescription+'</p><p style="margin-top:16px!important;"><a class="cob-button" href="'+def.href+'">Learn more &rarr;</a></p></div>';
  }

  try {
    var upcomingContainer = document.getElementById("cob-upcoming-holiday");
    var otherContainer = document.getElementById("cob-other-holidays");
    if (!upcomingContainer || !otherContainer) return;

    var formatter = new Intl.DateTimeFormat("en-u-ca-hebrew",{day:"numeric",month:"long",year:"numeric"});
    var today = new Date();
    today.setHours(0,0,0,0);
    var rangeStart = new Date(today);
    var rangeEnd = new Date(today);
    rangeStart.setDate(rangeStart.getDate() - 40);
    rangeEnd.setDate(rangeEnd.getDate() + 450);

    var occurrences = holidays.map(function (holiday) {
      return findRelevantOccurrence(holiday,rangeStart,rangeEnd,formatter,today);
    }).filter(Boolean).sort(function (a,b) {return a.start-b.start;});

    if (!occurrences.length) return;

    var upcoming = [occurrences[0]];
    if (occurrences[0].definition.id === "rosh-hashanah" || occurrences[0].definition.id === "yom-kippur") {
      ["yom-kippur","sukkot"].forEach(function (id) {
        var match = occurrences.find(function (occurrence) {
          return occurrence.definition.id === id;
        });
        if (match && !upcoming.some(function (occurrence) {return occurrence.definition.id === id;})) upcoming.push(match);
      });
    }

    var upcomingIds = upcoming.map(function (occurrence) {
      return occurrence.definition.id;
    });

    upcomingContainer.innerHTML = upcoming.map(comingCard).join("");
    otherContainer.innerHTML = holidays.filter(function (holiday) {
      return upcomingIds.indexOf(holiday.id) === -1;
    }).map(regularCard).join("");
  } catch (error) {
    /* Keep the static fallback already printed in the page. */
  }
}());
