window.addEventListener("load", (function () {
  const lefts = document.querySelectorAll(".left")
  const rights = document.querySelectorAll(".right")
  const img = document.querySelectorAll(".desktop .section1 .row2 .col2 .grid .col2 img")[0]
  const imgWidth = parseInt(getComputedStyle(img).getPropertyValue("width"));

  for (const left of lefts) {
    left.addEventListener("click", (function () {
      left.parentElement.parentElement.querySelector(".col2").scrollBy({ left: -imgWidth, behavior: "smooth" })
    }));
  }
    for (const right of rights) {
      right.addEventListener("click", (function () {
        right.parentElement.parentElement.querySelector(".col2").scrollBy({ left: imgWidth, behavior: "smooth" })
      }))
    }
}));