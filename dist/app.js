const urls = new URLSearchParams(window.location.search).get("url")

if(!urls) {
  console.log("URL ?")
  document.querySelector(".loading_prepar").innerHTML = `<span>URL ?</span> <form action="index.html"><input type="url" name="url" placeholder="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf"><input type="hidden" name="inputtype" value="focusing_by_form"></form>`
} else {
  let iv = -1
  for(let i in urls.split("/")) { iv++ }
  const title = urls?.split("/")[iv]?.split("?")[0]?.split("#")[0]
  document.querySelector("title").innerText = title
  PDF(urls)
  document.querySelector("[pdf-dwn]").href = urls
}