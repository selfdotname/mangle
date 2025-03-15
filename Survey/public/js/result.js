$(window).on("load", async function () {
  const res = await fetch("/api/totalpoll")
  const totalPoll = parseInt(await res.text())

  const spanPercents = document.querySelectorAll("span.percent")

  spanPercents.forEach(spanPercent => {
    const defaultPoll = parseInt(spanPercent.innerText)
    spanPercent.innerText = `${((defaultPoll / totalPoll) * 100).toFixed(2)} %`
  })
})