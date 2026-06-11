/* ═══════════════════════════════════════════════════════════
   KMeans — K-means++ 颜色聚类
   ═══════════════════════════════════════════════════════════ */

class KMeans {
  /**
   * 对像素进行 K-means 聚类
   * @param {Array<{r:number,g:number,b:number}>} pixels
   * @param {number} k  聚类数
   * @param {number} maxIter
   * @returns {Array<{color:{r:number,g:number,b:number}, ratio:number, hex:string}>}
   */
  static cluster(pixels, k = 5, maxIter = 30) {
    if (pixels.length === 0) return []

    // 如果像素太少，直接返回
    if (pixels.length <= k) {
      return pixels.map((p, i) => ({
        color: p,
        ratio: 1 / pixels.length,
        hex: KMeans.rgbToHex(p.r, p.g, p.b),
      }))
    }

    // 1. K-means++ 初始化质心
    const centroids = KMeans.initializeCentroids(pixels, k)

    // 2. 迭代聚类
    let clusters = []
    for (let iter = 0; iter < maxIter; iter++) {
      // 分配每个像素到最近的质心
      clusters = Array.from({ length: k }, () => [])

      for (const pixel of pixels) {
        let minDist = Infinity
        let closest = 0
        for (let i = 0; i < k; i++) {
          const dist = KMeans.colorDistance(pixel, centroids[i])
          if (dist < minDist) {
            minDist = dist
            closest = i
          }
        }
        clusters[closest].push(pixel)
      }

      // 更新质心
      let changed = false
      for (let i = 0; i < k; i++) {
        if (clusters[i].length === 0) continue
        const newCentroid = KMeans.averageColor(clusters[i])
        if (KMeans.colorDistance(newCentroid, centroids[i]) > 0.5) {
          centroids[i] = newCentroid
          changed = true
        }
      }

      if (!changed) break
    }

    // 3. 按簇大小排序（主色优先）
    const total = pixels.length
    return centroids
      .map((c, i) => ({
        color: c,
        ratio: clusters[i].length / total,
        hex: KMeans.rgbToHex(c.r, c.g, c.b),
      }))
      .sort((a, b) => b.ratio - a.ratio)
  }

  /**
   * K-means++ 初始化：后续质心离已有质心越远越好
   */
  static initializeCentroids(pixels, k) {
    const centroids = []

    // 第一个质心随机选取
    centroids.push({ ...pixels[Math.floor(Math.random() * pixels.length)] })

    for (let i = 1; i < k; i++) {
      // 计算每个像素到最近质心的距离
      const distances = pixels.map(p => {
        const minDist = Math.min(
          ...centroids.map(c => KMeans.colorDistance(p, c))
        )
        return minDist * minDist  // 平方权重
      })

      const totalDist = distances.reduce((a, b) => a + b, 0)
      if (totalDist === 0) {
        // 所有像素重合，随机选一个
        centroids.push({ ...pixels[Math.floor(Math.random() * pixels.length)] })
        continue
      }

      // 轮盘赌选择
      let rand = Math.random() * totalDist
      for (let j = 0; j < distances.length; j++) {
        rand -= distances[j]
        if (rand <= 0) {
          centroids.push({ ...pixels[j] })
          break
        }
      }
    }

    return centroids
  }

  /**
   * 加权颜色距离（人眼对绿色更敏感）
   */
  static colorDistance(a, b) {
    const dr = a.r - b.r
    const dg = a.g - b.g
    const db = a.b - b.b
    return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db)
  }

  /**
   * 计算簇的平均颜色
   */
  static averageColor(pixels) {
    const n = pixels.length
    if (n === 0) return { r: 0, g: 0, b: 0 }

    let r = 0, g = 0, b = 0
    for (const p of pixels) {
      r += p.r; g += p.g; b += p.b
    }
    return {
      r: Math.round(r / n),
      g: Math.round(g / n),
      b: Math.round(b / n),
    }
  }

  /**
   * RGB → Hex
   */
  static rgbToHex(r, g, b) {
    return '#' + [r, g, b]
      .map(x => Math.max(0, Math.min(255, Math.round(x)))
        .toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  }
}
