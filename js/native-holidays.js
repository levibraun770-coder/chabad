
(function () {
  "use strict";

  var holidays = [
    {id:"rosh-hashanah",name:"Rosh Hashanah",label:"Rosh Hashanah",description:"Services<br>Dinner<br>Shofar &amp; Lunch",learnDescription:"Rosh Hashanah prayers, customs, and holiday resources.",href:"/templates/articlecco_cdo/aid/7489168/jewish/Rosh-Hashanah.htm",month:["Tishri","Tishrei"],day:1,duration:2,clickable:true},
    {id:"yom-kippur",name:"Yom Kippur",label:"Yom Kippur",description:"Kol Nidrei<br>Services<br>Neilah &amp; Break-Fast",learnDescription:"Yom Kippur prayers, customs, and holiday resources.",href:"/templates/articlecco_cdo/aid/7489168/jewish/Rosh-Hashanah.htm",month:["Tishri","Tishrei"],day:10,duration:1,clickable:true},
    {id:"sukkot",name:"Sukkot & Simchat Torah",label:"Tishrei",description:"Celebrate Sukkot &amp; Simchat Torah in Bologna with services, meals, and community events.",learnDescription:"Programs, meals, services, and practical info.",href:"/holidays/JewishNewYear/template_cdo/aid/4784/jewish/Sukkot-Simchat-Torah.htm",month:["Tishri","Tishrei"],day:15,duration:9},
    {id:"chanukah",name:"Chanukah",label:"Kislev–Tevet",description:"Menorah lighting and community program information will be published here.",learnDescription:"Menorah lighting, customs, stories, recipes, and holiday resources.",href:"/holidays/chanukah/default_cdo/jewish/Hanukkah.htm",month:["Kislev"],day:25,duration:8},
    {id:"purim",name:"Purim",label:"Adar",description:"Megillah readings, celebrations, and practical info will be published here.",learnDescription:"Megillah, mitzvot, customs, stories, and Purim resources.",href:"/library/article_cdo/aid/638040/jewish/Purim.htm",month:["Adar","Adar II"],day:14,duration:1},
    {id:"pesach",name:"Pesach",label:"Nissan",description:"Seder, kosher food, holiday times, and practical info will be published here.",learnDescription:"Seder, chametz, customs, recipes, and Pesach resources.",href:"/holidays/passover/default_cdo/jewish/Passover-Pesach.htm",month:["Nisan","Nissan"],day:15,duration:8},
    {id:"shavuot",name:"Shavuot",label:"Sivan",description:"Torah learning, services, and celebration information will be published here.",learnDescription:"The giving of the Torah, customs, learning, and holiday resources.",href:"/library/article_cdo/aid/111377/jewish/Shavuot.htm",month:["Sivan"],day:6,duration:2}
  ];

  function hebrewParts(date, formatter) {
    var result = {};
    formatter.formatToParts(date).forEach(function (part) {
      if (part.type === "day" || part.type === "month" || part.type === "year") result[part.type] = part.value;
    });
    return {day:Number(result.day),month:result.month,year:result.year};
  }

  function findOccurrence(definition, fromDate, toDate, formatter) {
    var cursor = new Date(fromDate);
    while (cursor <= toDate) {
      var hp = hebrewParts(cursor, formatter);
      if (hp.day === definition.day && definition.month.indexOf(hp.month) !== -1) {
        var start = new Date(cursor);
        start.setDate(start.getDate() - 1);
        var end = new Date(start);
        end.setDate(end.getDate() + definition.duration);
        return {definition:definition,start:start,end:end,hyear:hp.year};
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
    var inner = '<p class="cob-kicker" style="color:#ef8a20;">'+formatRange(occurrence.start,occurrence.end)+'</p><h2>'+def.name+'</h2><p class="cob-upcoming-date">'+def.label+(occurrence.hyear?" "+occurrence.hyear:"")+'</p><p>'+def.description+'</p>';
    if (def.clickable) {
      return '<a class="cob-upcoming-card cob-upcoming-card-link" href="'+def.href+'">'+inner+'</a>';
    }
    return '<section class="cob-upcoming-card">'+inner+'<span class="cob-coming-soon">Information coming soon</span></section>';
  }

  function regularCard(def) {
    return '<a class="cob-card cob-holiday-card" href="'+def.href+'"><h3>'+def.name+'</h3><p>'+def.learnDescription+'</p><span class="cob-link">Learn more →</span></a>';
  }

  try {
    var formatter = new Intl.DateTimeFormat("en-u-ca-hebrew",{day:"numeric",month:"long",year:"numeric"});
    var today = new Date();
    today.setHours(0,0,0,0);
    var rangeStart = new Date(today);
    var rangeEnd = new Date(today);
    rangeStart.setDate(rangeStart.getDate()-35);
    rangeEnd.setDate(rangeEnd.getDate()+450);

    var occurrences = holidays.map(function (holiday) {
      return findOccurrence(holiday,rangeStart,rangeEnd,formatter);
    }).filter(Boolean).filter(function (occurrence) {
      var dayAfterEnd = new Date(occurrence.end);
      dayAfterEnd.setDate(dayAfterEnd.getDate()+1);
      return dayAfterEnd > today;
    }).sort(function (a,b) {return a.start-b.start;});

    if (occurrences.length) {
      var upcoming = [occurrences[0]];
      if (occurrences[0].definition.id === "rosh-hashanah") {
        ["yom-kippur","sukkot"].forEach(function (id) {
          var match = occurrences.find(function (occurrence) {
            return occurrence.definition.id === id;
          });
          if (match) upcoming.push(match);
        });
      }

      var upcomingIds = upcoming.map(function (occurrence) {
        return occurrence.definition.id;
      });

      document.getElementById("cob-upcoming-holiday").innerHTML = upcoming.map(comingCard).join("");
      document.getElementById("cob-other-holidays").innerHTML = holidays.filter(function (holiday) {
        return upcomingIds.indexOf(holiday.id) === -1;
      }).map(regularCard).join("");
    }
  } catch (error) {
    /* Keep the static fallback already printed in the page. */
  }
}());
