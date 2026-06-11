/* ═══════════════════════════════════════════════════════════
   Uploader — Drag & Drop / Click upload
   ═══════════════════════════════════════════════════════════ */

class Uploader {
  constructor(opts = {}) {
    this.onImage = opts.onImage || (() => {})
    this.init()
  }

  init() {
    this.zone      = document.getElementById('uploadZone')
    this.content   = document.getElementById('uploadContent')
    this.area      = document.getElementById('uploadArea')
    this.input     = document.getElementById('fileInput')
    this.preview   = document.getElementById('previewWrap')
    this.previewImg = document.getElementById('previewImage')

    // Click to upload
    this.area.addEventListener('click', () => this.input.click())
    this.input.addEventListener('change', e => {
      if (e.target.files[0]) this.process(e.target.files[0])
    })

    // Drag & drop
    this.zone.addEventListener('dragover', e => {
      e.preventDefault()
      this.area.classList.add('dragover')
    })
    this.zone.addEventListener('dragleave', () => {
      this.area.classList.remove('dragover')
    })
    this.zone.addEventListener('drop', e => {
      e.preventDefault()
      this.area.classList.remove('dragover')
      if (e.dataTransfer.files[0]) this.process(e.dataTransfer.files[0])
    })
  }

  process(file) {
    if (!file.type.startsWith('image/')) {
      const t = document.getElementById('toast')
      if (t) { t.querySelector('.toast-msg').textContent = '请上传图片文件'
        t.classList.add('show')
        setTimeout(() => t.classList.remove('show'), 2000) }
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        this.showPreview(img)
        this.onImage(img)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  showPreview(img) {
    this.previewImg.src = img.src
    this.content.classList.add('hidden')
    this.preview.classList.remove('hidden')
    void this.preview.offsetWidth
    this.preview.classList.add('visible')
  }

  reset() {
    this.content.classList.remove('hidden')
    this.preview.classList.add('hidden')
    this.preview.classList.remove('visible')
    this.previewImg.src = ''
    this.input.value = ''
  }
}
