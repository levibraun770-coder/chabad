(function(){
"use strict";
var frames=document.querySelectorAll(".cob-github-frame");
if(!frames.length)return;
window.addEventListener("message",function(event){
if(event.origin!=="https://levibraun770-coder.github.io")return;
if(!event.data||event.data.type!=="cob-frame-height"||typeof event.data.height!=="number")return;
if(event.data.height<200||event.data.height>10000)return;
for(var i=0;i<frames.length;i++){
if(event.source===frames[i].contentWindow){
frames[i].style.height=Math.ceil(event.data.height+2)+"px";
break;
}
}
},false);
})();