/* ═══════════════════════════════════════════════════════════
   PaletteGenerator — 基于色彩理论的配色方案生成器
   ═══════════════════════════════════════════════════════════ */

class PaletteGenerator {
  /**
   * 基于主色调生成完整配色方案
   * @param {Array<{color:{r,g,b}, ratio:number, hex:string}>} dominantColors
   * @returns {Array<{name:string, desc:string, colors:Array}>}
   */
  static generate(dominantColors) {
    if (!dominantColors.length) return []

    const base = dominantColors[0].color
    const hsl = PaletteGenerator.rgbToHsl(base.r, base.g, base.b)

    const schemes = []

    // 1. 互补色
    schemes.push({
      name: '互补',
      desc: '色环相对的颜色，强烈对比',
      colors: PaletteGenerator.makeComplementary(hsl),
    })

    // 2. 邻近色
    schemes.push({
      name: '邻近',
      desc: '色环相邻，和谐统一',
      colors: PaletteGenerator.makeAnalogous(hsl),
    })

    // 3. 三角色
    schemes.push({
      name: '三角',
      desc: '色环三等分，丰富而平衡',
      colors: PaletteGenerator.makeTriadic(hsl),
    })

    // 4. 分裂互补
    schemes.push({
      name: '分裂互补',
      desc: '互补色两侧的邻近色，强烈而细腻',
      colors: PaletteGenerator.makeSplitComplementary(hsl),
    })

    // 5. 单色
    schemes.push({
      name: '单色',
      desc: '同一色相，不同明度',
      colors: PaletteGenerator.makeMonochromatic(hsl),
    })

    return schemes
  }

  /* ═══ Color Conversion ═══ */

  static rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: h * 360,
      s: Math.max(0, Math.min(1, s)),
      l: Math.max(0, Math.min(1, l)),
    }
  }

  static hslToRgb(h, s, l) {
    h /= 360
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  static rgbToHex(r, g, b) {
    return '#' + [r, g, b]
      .map(x => Math.max(0, Math.min(255, Math.round(x)))
        .toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  }

  static hslToHex(h, s, l) {
    const { r, g, b } = PaletteGenerator.hslToRgb(h, s, l)
    return PaletteGenerator.rgbToHex(r, g, b)
  }

  /**
   * 格式化颜色对象（同时包含 hsl / hex / rgb）
   */
  static formatColor(h, s, l) {
    const { r, g, b } = PaletteGenerator.hslToRgb(h, s, l)
    return {
      hsl: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      hex: PaletteGenerator.rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
    }
  }

  /* ═══ Scheme Generators ═══ */

  /**
   * 互补色: hue + 180°
   */
  static makeComplementary(hsl) {
    const { h, s, l } = hsl
    return [
      PaletteGenerator.formatColor(h, s, l),
      PaletteGenerator.formatColor((h + 180) % 360, s, l),
    ]
  }

  /**
   * 邻近色: hue ± 30°
   */
  static makeAnalogous(hsl) {
    const { h, s, l } = hsl
    return [
      PaletteGenerator.formatColor(h, s, l),
      PaletteGenerator.formatColor((h - 30 + 360) % 360, s * 0.9, l),
      PaletteGenerator.formatColor((h + 30) % 360, s * 0.9, l),
    ]
  }

  /**
   * 三角色: hue ± 120°
   */
  static makeTriadic(hsl) {
    const { h, s, l } = hsl
    return [
      PaletteGenerator.formatColor(h, s, l),
      PaletteGenerator.formatColor((h + 120) % 360, s, l * 0.9),
      PaletteGenerator.formatColor((h + 240) % 360, s, l * 0.9),
    ]
  }

  /**
   * 分裂互补: 互补色两侧的邻近色
   */
  static makeSplitComplementary(hsl) {
    const { h, s, l } = hsl
    const comp = (h + 180) % 360
    return [
      PaletteGenerator.formatColor(h, s, l),
      PaletteGenerator.formatColor((comp - 30 + 360) % 360, s * 0.85, l * 0.95),
      PaletteGenerator.formatColor((comp + 30) % 360, s * 0.85, l * 0.95),
    ]
  }

  /**
   * 单色: 同一色相，不同明度 / 饱和度
   */
  static makeMonochromatic(hsl) {
    const { h, s, l } = hsl
    const variants = [
      { l: 0.25, s: s * 0.7 },
      { l: Math.min(1, l + 0.15), s },
      { l, s },
      { l: Math.max(0, l - 0.15), s },
      { l: 0.85, s: s * 0.5 },
    ]

    return variants.map(v =>
      PaletteGenerator.formatColor(h, v.s, v.l)
    )
  }
}
