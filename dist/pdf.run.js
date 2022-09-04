function PDF(urls, option) {
  /**
  * Example Project On https://jsfiddle.net/pdfjs/wagvs9Lf/ | https://mozilla.github.io/pdf.js/examples/
  */
  let btnScale = document.getElementById(option?.btnaScale || "btn-scale")
  let btnNext  = document.getElementById(option?.btnaNext || "btn-next")
  let btnPre   = document.getElementById(option?.btnaPre || "btn-pre")

  var url = urls
  var pdfjsLib = window['pdfjs-dist/build/pdf'];
  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc = './dist/pdf.worker.js';
  let pdfDoc = null
  let pageNum = 1
  let pageRendering = false
  let pageNumPending = null
  let scale = 1
  let canvas = document.getElementById('the-canvas')
  let ctx = canvas.getContext('2d');
  let valpg = function (text) {
    document.getElementById("pages_num").innerText = text
  }

  function RenderPDF(valnum, valpage) {
    pageRendering = true;
    pdfDoc.getPage(valnum).then((p) => {
      let viewport = p.getViewport({scale: scale})
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      let renderTask = p.render({
        canvasContext: ctx,
        viewport: viewport
      })
      // Render Task
      renderTask.promise.then(() => {
        pageRendering = false;
        if(pageNumPending !== null) {
          RenderPDF(pageNumPending, valpage)
          pageNumPending = null
        }
      })
    })
    valpg(`${pageNum} / ${pdfDoc.numPages}`)
  }
  function WaitRenderPage(valnum, valpage) {
    if (pageRendering) {
      pageNumPending = valnum;
    } else {
      RenderPDF(valnum, valpage)
    }
  }
  function prePage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    WaitRenderPage(pageNum, pdfDoc.numPages);
  }
  function nextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    WaitRenderPage(pageNum, pdfDoc.numPages);
  }
  pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    console.log(pdfDoc_)
    // Initial/first page rendering
    RenderPDF(pageNum, pdfDoc.numPages);
    valpg(`${pageNum} / ${pdfDoc.numPages}`)
    document.querySelector(".loading_prepar").remove()
  }).catch(err => {
    document.querySelector(".loading_prepar").remove()
    console.log(err)
  })

  btnScale.onchange = function () {
    scale = Number(btnScale.value)
    RenderPDF(pageNum, pdfDoc.numPages)
  }
  btnNext.onclick = function () {
    nextPage()
  }
  btnPre.onclick = function () {
    prePage()
  }
}