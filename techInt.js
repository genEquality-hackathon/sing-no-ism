let linksArr = [...document.getElementsByTagName('a')]



linksArr.forEach((link,idx) => {
  let parentNode = link.parentNode
  let textLink = link.innerText
  let newP = document.createElement('span')
  newP.innerText = textLink
  let newRef = document.createElement('sup')
  let aTag = document.createElement('a')
  aTag.href = link.href
  aTag.innerText = `[${idx+1}]`
  newRef.appendChild(aTag)
  newP.appendChild(newRef)
  parentNode.replaceChild(newP, link)
})
