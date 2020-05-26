const url = 'samplePDF.pdf';

let pdf = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');

// Render the page
const renderpage = num => {
  pageIsRendering = true;

  // Get the page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext : ctx,
      viewport
    }

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderpage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Output cuurent page
    document.querySelector('#page-num').textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  }
  else {
    renderpage(num);
  }
}

// show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  else {
    pageNum--;
    queueRenderPage(pageNum);
  }
}

// show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  else {
    pageNum++;
    queueRenderPage(pageNum);
  }
}

// Get the document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;

  document.querySelector('#page-count').textContent = pdfDoc.numPages;

  renderpage(pageNum);
})
  .catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div,canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button events
document.querySelector('#prev-page').addEventListener('click',showPrevPage);
document.querySelector('#next-page').addEventListener('click',showNextPage);
