document.querySelectorAll("article a").forEach(link => {
    link.closest("article").addEventListener("click", function(event) {
      // Prevent navigation if an actual <a> tag was clicked
      if (event.target.tagName.toLowerCase() === "a") return;
  
      // Otherwise, navigate to the link's href
      window.location.href = link.href;
    });
  });