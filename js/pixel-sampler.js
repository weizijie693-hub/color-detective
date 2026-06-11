/* ═══════════════════════════════════════════════════════════
   PixelSampler — Canvas 像素采样
   ═══════════════════════════════════════════════════════════ */

class PixelSampler {
  /**
   * 从 Image 对象中采样像素
   * @param {HTMLImageElement} img
   * @param {number} maxSample  最大采样点数（控制性能）
   * @returns {Array<{r:number,g:number,b:number}>}
   */
  static sample(img, maxSample = 10000) {
    // 1. 创建离屏 Canvas，将图片缩放到合理尺寸
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 计算缩放比例，使像素总数 ≈ maxSample
    const totalPixels = img.width * img.height
    const scale = Math.min(1, Math.sqrt(maxSample / totalPixels))
    canvas.width = Math.max(1, Math.round(img.width * scale))
    canvas.height = Math.max(1, Math.round(img.height * scale))

    // 绘制缩放后的图片
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // 2. 读取像素数据
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    const sampled = []

    // 3. 步长采样 — 进一步降采样
    const step = Math.max(1, Math.floor((canvas.width * canvas.height) / maxSample))

    for (let i = 0; i < pixels.length; i += step * 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const a = pixels[i + 3]

      // 跳过透明像素
      if (a < 128) continue

      // 跳过接近纯黑或纯白的像素（通常是噪点或边缘）
      const brightness = (r + g + b) / 3
      if (brightness < 10 || brightness > 245) continue

      sampled.push({ r, g, b })
    }

    return sampled
  }
}
