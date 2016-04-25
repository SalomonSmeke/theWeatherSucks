function bindInteractivity(){
  bindZip();
}

function bindZip(){
  $("#zip").submit(function(e){
    e.preventDefault();
    console.log(e);
    var numberMaybe = isNumber(document.getElementById("getme").value);
    if(numberMaybe === false){
      document.getElementById("getme").value = "invalid";
    } else {
      $(".hidemebro").show();
      window.scrollTo(0, document.getElementById("page_1").offsetTop);
      load(numberMaybe);
    }
  });
}
