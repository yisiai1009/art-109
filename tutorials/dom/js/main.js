
document.querySelector("#image-1"). addEventListener("click",function(){
    document.querySelector("#image-1").style.visibility = "hidden"
})

document.querySelector("#image-2"). addEventListener("click",function(){
    document.querySelector("#image-2").style.visibility = "hidden"
})

document.querySelector("#image-3"). addEventListener("click",function(){
    document.querySelector("#image-3").style.visibility = "hidden"
})

document.querySelector("#image-4"). addEventListener("click",function(){
    document.querySelector("#image-4").style.visibility = "hidden"
})

document.querySelector("#image-5"). addEventListener("click",function(){
    document.querySelector("#image-5").style.visibility = "hidden"
})

document.querySelector("#image-6"). addEventListener("click",function(){
    document.querySelector("#image-6").style.visibility = "hidden"
})

document.querySelectorAll(".image-div").forEach(function(div) {
  div.style.position = "absolute";
  div.style.left = Math.random() * window.innerWidth * 0.8 + "px";
  div.style.top = Math.random() * window.innerHeight * 0.8 + "px";
  div.style.width = "150px";
  div.style.height = "150px";
});