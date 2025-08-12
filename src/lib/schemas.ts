import { z } from 'zod'

// Example form schemas
export const exampleFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old').max(120, 'Invalid age'),
})

export const csvUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type === 'text/csv', 'File must be a CSV'),
})

export const excelUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel',
    'File must be an Excel file'
  ),
})

// Export types
export type ExampleFormData = z.infer<typeof exampleFormSchema>
export type CsvUploadData = z.infer<typeof csvUploadSchema>
export type ExcelUploadData = z.infer<typeof excelUploadSchema>
