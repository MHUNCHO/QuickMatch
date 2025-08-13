import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// CSV processing utilities
export const csvUtils = {
  parseCSV(file: File): Promise<Record<string, unknown>[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<Record<string, unknown>>) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${results.errors.map((e: Papa.ParseError) => e.message).join(', ')}`))
          } else {
            resolve(results.data)
          }
        }
      })
    })
  },

  exportToCSV(data: Record<string, unknown>[], filename: string = 'export.csv') {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Excel processing utilities
export const excelUtils = {
  parseExcel(file: File): Promise<Record<string, unknown>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]
          resolve(jsonData)
        } catch (error) {
          reject(new Error(`Excel parsing failed: ${error}`))
        }
      }
      reader.onerror = () => reject(new Error('File reading failed'))
      reader.readAsArrayBuffer(file)
    })
  },

  exportToExcel(data: Record<string, unknown>[], filename: string = 'export.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, filename)
  }
}
