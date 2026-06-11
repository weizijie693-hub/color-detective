/* ═══════════════════════════════════════════════════════════
   UI — Rendering Engine (Swiss Minimalist)
   ═══════════════════════════════════════════════════════════ */

class UI {
  constructor() {
    this.results         = document.getElementById('results')
    this.dominantSection = document.getElementById('dominantSection')
    this.dominantStrip   = document.getElementById('dominantStrip')
    this.dominantActions = document.getElementById('dominantActions')
    this.schemeSection   = document.getElementById('schemeSection')
    this.schemes         = document.getElementById('schemes')
    this.toast           = document.getElementById('toast')
    this.toastMsg        = this.toast?.querySelector('.toast-msg')
    this.loader          = document.getElementById('loaderScreen')
    this._colors = []
    this._schemes = []
  }

  showLoader() {
    this.loader?.classList.remove('hidden')
  }

  hideLoader() {
    this.loader?.classList.add('hidden')
  }

  /* ─── Render dominant colors ─── */
  renderDominant(colors) {
    this._colors = colors
    this.dominantSection.classList.remove('hidden')
    const labels = ['主色', '辅色', '辅色', '辅色', '辅色']

    this.dominantStrip.innerHTML = colors.map((c, i) => `
      <div class="color-block" style="background:${c.hex}"
           data-hex="${c.hex}">
        <span class="color-block-label">${labels[i]}</span>
        <div class="color-block-info">
          <div class="color-block-hex">${c.hex.toLowerCase()}</div>
          <div class="color-block-ratio">${(c.ratio * 100).toFixed(0)}%</div>
        </div>
      </div>
    `).join('')

    this.dominantStrip.querySelectorAll('.color-block').forEach(el => {
      el.addEventListener('click', () => this.copy(el.dataset.hex))
    })

    this.dominantActions.classList.remove('hidden')
  }

  /* ─── Render schemes ─── */
  renderSchemes(schemes) {
    this._schemes = schemes
    this.schemeSection.classList.remove('hidden')

    this.schemes.innerHTML = schemes.map((s, gi) => `
      <div class="scheme-group" style="transition-delay:${gi * 0.06}s">
        <div class="scheme-head">
          <span class="scheme-name">${s.name}</span>
          <span class="scheme-desc">${s.desc}</span>
          <span class="scheme-head-line"></span>
        </div>
        <div class="scheme-strip">
          ${s.colors.map(c => `
            <div class="scheme-swatch"
                 style="background:${c.hex}"
                 data-hex="${c.hex}" data-hsl="${c.hsl}" data-rgb="${c.rgb}">
              <span class="scheme-swatch-hex">${c.hex.toLowerCase()}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')

    // Single swatch click → copy hex
    this.schemes.querySelectorAll('.scheme-swatch').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation()
        this.copy(el.dataset.hex)
      })
      el.addEventListener('contextmenu', e => {
        e.preventDefault()
        this.copy(el.dataset.hsl)
      })
    })

    // Strip click → copy all
    this.schemes.querySelectorAll('.scheme-strip').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.classList.contains('scheme-swatch')) return
        const hexes = Array.from(el.querySelectorAll('.scheme-swatch'))
          .map(h => h.dataset.hex)
          .join(', ')
        this.copy(hexes)
      })
    })

    // Staggered entrance
    requestAnimationFrame(() => {
      this.schemes.querySelectorAll('.scheme-group').forEach(el => {
        el.classList.add('visible')
      })
    })
  }

  /* ─── Show results container ─── */
  showResults() {
    this.results.classList.remove('hidden')
    void this.results.offsetWidth
    this.results.classList.add('visible')
  }

  /* ─── Copy ─── */
  async copy(text) {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select(); document.execCommand('copy')
      document.body.removeChild(ta)
    }
    this.showToast(text.length > 30 ? text.slice(0, 28) + '…' : text)
  }

  /* ─── Toast ─── */
  showToast(msg) {
    if (!this.toastMsg) return
    this.toastMsg.textContent = msg
    this.toast.classList.add('show')
    clearTimeout(this._toastTimer)
    this._toastTimer = setTimeout(() => this.toast.classList.remove('show'), 2000)
  }

  /* ─── Clear ─── */
  clear() {
    this.dominantSection.classList.add('hidden')
    this.dominantStrip.innerHTML = ''
    this.dominantActions.classList.add('hidden')
    this.schemeSection.classList.add('hidden')
    this.schemes.innerHTML = ''
    this.results.classList.remove('visible')
    this.results.classList.add('hidden')
  }

  getColors() { return this._colors }
  getSchemes() { return this._schemes }
}
