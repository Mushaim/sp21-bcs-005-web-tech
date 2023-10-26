function doBindings() {
  
    let logo = document.getElementById("logo");
    logo.onclick = removeMainMenu; 
  }
  
  window.onload = doBindings;
  
  function removeMainMenu() {
    let mainMenu = document.getElementById("main-menu"); 
    if (mainMenu) {
      mainMenu.style.display = "none";
    }
  }
  