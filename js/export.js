/* ═══════════════════════════════════════════════════════════
   Export — 导出色卡 / 复制 CSS 变量
   ═══════════════════════════════════════════════════════════ */

class Exporter {
  /**
   * 导出主色调色卡为 PNG
   * @param {Array} colors  [{ hex, ratio }]
   */
  static exportPaletteImage(colors) {
    if (!colors || colors.length === 0) return

    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    const count = colors.length
    const blockW = 160
    const blockH = 240
    const pad = 20
    const barH = 40

    c.width = count * blockW + pad * 2
    c.height = blockH + barH + pad * 2

    // 背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, c.width, c.height)

    // 标题
    ctx.fillStyle = '#1a1a1a'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('COLOR PALETTE', c.width / 2, 16)

    // 色块
    colors.forEach((color, i) => {
      const x = pad + i * blockW
      const y = pad + 14

      // 色块
      ctx.fillStyle = color.hex
      ctx.fillRect(x, y, blockW - 4, blockH)

      // 边框
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, blockW - 4, blockH)

      // Hex 文字
      ctx.fillStyle = '#1a1a1a'
      ctx.font = '12px SF Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(color.hex.toLowerCase(), x + (blockW - 4) / 2, y + blockH + 18)

      // 比例
      ctx.fillStyle = '#999999'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText(`${(color.ratio * 100).toFixed(0)}%`, x + (blockW - 4) / 2, y + blockH + 34)
    })

    // 下载
    const link = document.createElement('a')
    link.download = 'palette.png'
    link.href = c.toDataURL('image/png')
    link.click()
  }

  /**
   * 生成 CSS 自定义属性字符串
   */
  static toCSSVariables(colors) {
    if (!colors || colors.length === 0) return ''

    const labels = ['primary', 'secondary-1', 'secondary-2', 'secondary-3', 'secondary-4']
    const lines = [':root {']
    colors.forEach((c, i) => {
      const name = labels[i] || `color-${i + 1}`
      lines.push(`  --${name}: ${c.hex.toLowerCase()};`)
    })
    lines.push('}')
    return lines.join('\n')
  }

  /**
   * 复制所有 Hex
   */
  static allHexes(colors) {
    return colors.map(c => c.hex.toLowerCase()).join(', ')
  }
}
