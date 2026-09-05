import type { Participant } from '../types'

/**
 * Generates an Excel-friendly CSV string.
 * Uses UTF-8 BOM (\uFEFF) and Excel literal formula format `="PHONE"`
 * to prevent Microsoft Excel from converting 10-digit phone numbers
 * into scientific exponential notation (e.g. 9.88E+09).
 */
export function formatParticipantsForExcelCsv(
  participants: Array<{ name: string; phone: string; address?: string; location?: string }>,
): string {
  const header = 'Full Name,Phone Number,Address,Location\r\n'
  const rows = participants.map((p) => {
    const cleanPhone = p.phone.replace(/\D/g, '').slice(-10)
    const escapedName = `"${(p.name || '').replace(/"/g, '""')}"`
    // Excel formula format `="9876543210"` guarantees Excel treats it as literal string without scientific notation (E+09)
    const excelPhone = `="""${cleanPhone}"""`
    const escapedAddress = `"${(p.address || '').replace(/"/g, '""')}"`
    const escapedLocation = `"${(p.location || 'Valanchery').replace(/"/g, '""')}"`
    return `${escapedName},${excelPhone},${escapedAddress},${escapedLocation}`
  })

  return '\uFEFF' + header + rows.join('\r\n')
}

/**
 * Triggers a file download in the browser.
 */
export function downloadCsvFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parses uploaded CSV text into structured participant records.
 */
export function parseCsvText(
  text: string,
): Array<{ name: string; phone: string; address: string; location: string }> {
  // Normalize newlines and remove BOM
  const clean = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = clean.split('\n').filter((l) => l.trim().length > 0)
  if (lines.length <= 1) return []

  // Skip header
  const dataLines = lines.slice(1)
  const results: Array<{ name: string; phone: string; address: string; location: string }> = []

  for (const line of dataLines) {
    const cols = parseCsvLine(line)
    if (cols.length >= 2) {
      const name = cleanCell(cols[0])
      const phone = cleanCell(cols[1]).replace(/\D/g, '').slice(-10)
      const address = cols[2] ? cleanCell(cols[2]) : 'Valanchery'
      const location = cols[3] ? cleanCell(cols[3]) : 'Valanchery'

      if (name && phone.length >= 10) {
        results.push({ name, phone, address, location })
      }
    }
  }

  return results
}

function cleanCell(val: string): string {
  if (!val) return ''
  let res = val.trim()
  // Strip excel formula syntax like `="9876543210"` or `"""9876543210"""`
  if (res.startsWith('="') && res.endsWith('"')) {
    res = res.slice(2, -1)
  }
  if (res.startsWith('"') && res.endsWith('"')) {
    res = res.slice(1, -1)
  }
  return res.replace(/""/g, '"').trim()
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}
