var baseURL = "https://github.com/gftruj/webzamples/tree/master/"
codeBtnUrl = null

window.onload = addCodeBtn

function setCodeBtnUrl(url) {
	codeBtnUrl = url;
}

function addCodeBtn() {
	// stylesheets
	var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    // 	link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'misc/codeBtn.css';
    link.media = 'all';
    head.appendChild(link);

    let icon = document.createElement("i")
    icon.classList.add("showCode", "fas", "fa-lg", "fa-code")
    document.body.append(icon)

    icon.addEventListener("click", e => {
      window.open(baseURL + codeBtnUrl)
    })
}
