'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { csvUtils, excelUtils } from '@/lib/file-utils'

export function FileUpload() {
  const [csvData, setCsvData] = useState<any[]>([])
  const [excelData, setExcelData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const data = await csvUtils.parseCSV(file)
      setCsvData(data)
      console.log('CSV data:', data)
    } catch (error) {
      console.error('CSV parsing error:', error)
      alert(`Error parsing CSV: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const data = await excelUtils.parseExcel(file)
      setExcelData(data)
      console.log('Excel data:', data)
    } catch (error) {
      console.error('Excel parsing error:', error)
      alert(`Error parsing Excel: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const exportCSV = () => {
    if (csvData.length > 0) {
      csvUtils.exportToCSV(csvData, 'exported-data.csv')
    }
  }

  const exportExcel = () => {
    if (excelData.length > 0) {
      excelUtils.exportToExcel(excelData, 'exported-data.xlsx')
    }
  }

  return (
    <div className="space-y-6">
      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle>CSV File Upload</CardTitle>
          <CardDescription>
            Upload and parse CSV files using Papaparse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-upload">Select CSV File</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              disabled={isProcessing}
            />
          </div>
          
          {csvData.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Parsed {csvData.length} rows from CSV
              </p>
              <Button onClick={exportCSV} variant="outline" size="sm">
                Export to CSV
              </Button>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                <pre className="text-xs">
                  {JSON.stringify(csvData.slice(0, 3), null, 2)}
                  {csvData.length > 3 && '\n...'}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Excel Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Excel File Upload</CardTitle>
          <CardDescription>
            Upload and parse Excel files using SheetJS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excel-upload">Select Excel File</Label>
            <Input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              disabled={isProcessing}
            />
          </div>
          
          {excelData.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Parsed {excelData.length} rows from Excel
              </p>
              <Button onClick={exportExcel} variant="outline" size="sm">
                Export to Excel
              </Button>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                <pre className="text-xs">
                  {JSON.stringify(excelData.slice(0, 3), null, 2)}
                  {excelData.length > 3 && '\n...'}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isProcessing && (
        <div className="text-center text-muted-foreground">
          Processing file...
        </div>
      )}
    </div>
  )
}
