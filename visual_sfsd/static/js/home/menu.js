let imageHtmlElement = document.querySelector(".hero-img")
let imageHtmlElementOfSet =  imageHtmlElement.offsetTop;
(function($) { // Begin jQuery
    $(function() { // DOM ready
      // If a link has a dropdown, add sub menu toggle.
      
      // Clicking away from dropdown will remove the dropdown class
      
      // Toggle open and close nav styles on click
      $('#nav-toggle').click(function() {
        $('.nav-container a').slideToggle();
        
        console.log("s")
      });
      // Hamburger to X toggle
      $('#nav-toggle').on('click', function() {
        this.classList.toggle('active');
      });
    }); // end DOM ready
  })(jQuery); // end jQuery

  window.addEventListener("resize",()=> {
        if (innerWidth>768) {
            console.log("ssss");
            document.querySelectorAll(".nav-container a").forEach((i) =>{i.style.display="block"}) ;
        }
        else{
          if (!document.getElementById("nav-toggle").classList.contains("active")) {
            document.querySelectorAll(".nav-container a").forEach((i) =>{i.style.display="none"}) ;          }
        }
        imageHtmlElementOfSet = imageHtmlElement.offsetTop;
        
  })


var lastScrollTop = 0;
navbar = document.querySelector("nav");
window.addEventListener("scroll", function(){
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && !document.getElementById("nav-toggle").classList.contains("active")) {
      navbar.style.top = "-80px";

  }
  else if(scrollTop > lastScrollTop && this.innerWidth>768) {
    navbar.style.top = "-80px";
  }
  else {
      navbar.style.top="0";
  }
  lastScrollTop = scrollTop;

})





const sections = document.querySelectorAll(".sec");
console.log(sections);
let navBgOn = false
const NavList = document.querySelectorAll(".nav-container a");
window.addEventListener("scroll", ()=>{
    let current = ''; 
    sections.forEach( section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset > ( sectionTop - sectionHeight /2) && window.pageYOffset<(sectionTop+sectionHeight)) {
            current = section.getAttribute('id');
        }
    })
    NavList.forEach(li => {
        li.classList.remove("activeSect");
        console.log(li.id)

        if (li.id.includes(current)) {
            li.classList.add('activeSect');
            
        }
    })
    
        if (window.pageYOffset >= imageHtmlElementOfSet) {
          if (!navBgOn) {
            navbar.classList.add("md:bg-indigo-500")
            navBgOn = true
          }
        }
        else {
          if (navBgOn) {
            navbar.classList.remove("md:bg-indigo-500")
            navBgOn = false;
          }
        }
  })


$(".link").on("click", function(e) {
  console.log(this.hash);
  if (this.hash !== '') {
      e.preventDefault();

      const hash = this.hash;

      $('html, body').animate({
          scrollTop: $(hash).offset().top
      },800);
      if (document.getElementById("nav-toggle").classList.contains("active") && innerWidth<=768) {
      document.getElementById("nav-toggle").classList.toggle("active");
      document.querySelectorAll(".nav-container a").forEach((i) =>{i.style.display="none"})
      }
  }
});





